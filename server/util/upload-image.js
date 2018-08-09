/*
 * 1) upload image to _TEMP
 * 2) redimention si es bitmap
 * 3) upload images to S3
 * 4) remove temp images fron /upload
 */

import mkdirp from 'mkdirp'
import del from 'delete'
import storeFileTemp from './storeFileTemp'
import resizeImg from './resizeImage'
import uploadFile from './upload-s3'

// Ensure upload directory exists
const uploadDir = './uploads'
mkdirp.sync(uploadDir)

export default async (file, sizes, folderS3) => {
  // Subir imagen a folder temporal y guardar su locacion
  const { stream, filename, mimetype } = await file
  const { pathTemp, ext } = await storeFileTemp({ stream, filename })

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

    // Eliminar imagenes temporales
    await del(pathTemp)
    return output
  }
}
