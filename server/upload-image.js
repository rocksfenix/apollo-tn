// https://www.facebook.com/profile.php?id=100012656892787
/*
 * 1) upload image to _TEMP
 * 2) redimention small & medium
 * 3) upload images to S3
 * 4) remove 3 images from _TEMP
 */

import mkdirp from 'mkdirp'
import shortid from 'shortid'
import fs from 'fs'
import path from 'path'
import del from 'delete'
import S3 from './connections/S3'
const gm = require('gm').subClass({
  imageMagick: true
})

const BUCKET = process.env.S3_BUCKET
// Ensure upload directory exists
const uploadDir = './uploads'
mkdirp.sync(uploadDir)

const storeImageTemp = ({ stream, filename }) => {
  const id = shortid.generate()
  const pathTemp = `${uploadDir}/${id}-${filename}`
  const ext = path.extname(filename)
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated) {
        // Delete the truncated file
          fs.unlinkSync(pathTemp)
        }
        reject(error)
      })
      .pipe(fs.createWriteStream(pathTemp))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, pathTemp, ext }))
  )
}

// endName es el nombre final que se almacenara en S3
// filename es el nombre original del archivo
const resizeImg = async ({ pathTemp, suffix, ext, size, mimetype, filename, endName }) => {
  return new Promise((resolve, reject) => {
    gm(pathTemp).resize(size).write(`${pathTemp}-${suffix}${ext}`, (err) => {
      if (err) return reject(err)
      resolve({
        filePath: `${pathTemp}-${suffix}${ext}`,
        filename,
        ext,
        endName,
        suffix: suffix,
        mimetype: mimetype
      })
    })
  })
}

const uploadFile = ({ filename, filePath, mimetype, endName, suffix, ext, folderS3 = '' }) => {
  const fileNameEnd = endName
    ? `${folderS3}/${endName}-${suffix}${ext}`
    : `${folderS3}/${filename}-${suffix}${ext}`

  console.log('KEY::::: ', fileNameEnd)

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    S3.upload({
      Bucket: BUCKET,
      Key: fileNameEnd,
      Body: stream,
      ACL: 'public-read',
      ContentType: mimetype,
      Metadata: {
        'Content-Type': mimetype
      }

    }, (err, docs) => {
      if (err) {
        return reject(err)
      }
      const source = docs.Location.replace('https://s3.us-west-2.amazonaws.com/tecninja.io', 'https://dxpdcvj89hnue.cloudfront.net')
      resolve(source)
    })
  })
}

export default async (file, sizes, folderS3) => {
  // Subir imagen a folder temporal y guardar su locacion
  const { stream, filename, mimetype } = await file
  const { pathTemp, ext } = await storeImageTemp({ stream, filename })
  // console.log(id, filename, mimetype, pathTemp, ext, encoding)
  // console.log(typeof filename);
  let output = {}

  // Si es bitmap redimencionar
  if (ext !== '.svg') {
    let imagesTmp = await Promise.all(sizes.map(async file =>
      resizeImg({ pathTemp, ext, filename, mimetype, ...file })
    ))

    // Subir imagenes y conservar location
    await Promise.all(imagesTmp.map(async file => {
      const location = await uploadFile({ ...file, folderS3 })
      output[file.suffix] = location
    }))

    console.log(output)

    // Eliminar imagenes temporales
    await del(pathTemp)
    await del(imagesTmp.map(f => f.filePath))

    return output
  }

  // Si es imagen SVG
  if (ext === '.svg') {
    const location = await uploadFile({
      folderS3,
      filePath: pathTemp,
      filename,
      ext,
      suffix: 'vector',
      mimetype: mimetype
    })

    sizes.forEach(file => {
      output[file.suffix] = location
    })

    console.log(output)

    // Eliminar imagenes temporales
    await del(pathTemp)
    return output
  }
}
