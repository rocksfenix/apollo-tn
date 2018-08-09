import fs from 'fs'
import S3 from '../connections/S3'

const BUCKET = process.env.S3_BUCKET

const uploadFile = ({ filename, filePath, mimetype, endName, suffix, ext, folderS3 = '' }) => {
  // Se elimina la extencion del archivo
  const _filename = filename.split('.').slice(0, -1).join('.')

  // Se toma o el nombre del archivo o el nombre final + extension
  let FINAL_NAME = endName
    ? `${folderS3}/${endName}${ext}`
    : `${folderS3}/${_filename}${ext}`

  // Si existe subfijo
  if (suffix) {
    FINAL_NAME = endName
      ? `${folderS3}/${endName}-${suffix}${ext}`
      : `${folderS3}/${_filename}-${suffix}${ext}`
  }

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    S3.upload({
      Bucket: BUCKET,
      Key: FINAL_NAME,
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

export default uploadFile
