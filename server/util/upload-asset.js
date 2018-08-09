import del from 'delete'
import storeFileTemp from './storeFileTemp'
import resizeImg from './resizeImage'
import uploadFile from './upload-s3'
import getFileSize from './getFileSize'

// { filename, filePath, mimetype, endName, suffix, ext, folderS3 = '' }
export default async (file, folderS3) => {
  // Subir el archivo o imagen a temporal
  const { stream, filename, mimetype } = await file
  const { pathTemp, ext } = await storeFileTemp({ stream, filename })

  const size = getFileSize(pathTemp)
  // las imagenes si son de la resoluccion original y un thumbnail de 30 px

  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    // tratar como imagen bitmap
    // Redimencionar a
    const sizes = [
      { size: 30, suffix: 's30' },
      { size: 50, suffix: 's50' },
      { size: 100, suffix: 's100' }
    ]

    let thumbnail = {}
    // const thumbnail = await resizeImg({ pathTemp, ext, filename, mimetype, size: 30 })

    // Redimencionamos
    let imagesTmp = await Promise.all(sizes.map(async file =>
      resizeImg({ pathTemp, ext, filename, mimetype, ...file })
    ))

    // Subimos imagen original
    const location = await uploadFile({
      filename,
      filePath: pathTemp,
      mimetype,
      ext,
      folderS3
    })

    // Subimos los thumbnails
    await Promise.all(imagesTmp.map(async file => {
      const location = await uploadFile({ ...file, folderS3 })
      thumbnail[file.suffix] = location
    }))

    // Eliminar imagenes temporales
    await del(pathTemp, (err) => console.log(err))
    await del(imagesTmp.map(f => f.filePath))

    return {
      type: 'image',
      ext,
      location,
      size,
      thumbnail
    }
  }

  if (ext === '.svg') {
    // subir imagene svg y conservar en locacion
    const location = await uploadFile({
      filename,
      filePath: pathTemp,
      mimetype,
      ext,
      folderS3
    })

    await del(pathTemp, (err) => console.log(err))

    return {
      type: 'image',
      location,
      size,
      ext,
      thumbnail: {
        s30: location,
        s50: location,
        s100: location
      }
    }
  }

  // Subir asset de otro tipo
  const location = await uploadFile({
    filename,
    filePath: pathTemp,
    mimetype,
    ext,
    folderS3
  })

  await del(pathTemp, (err) => console.log(err))

  return {
    type: 'file',
    size,
    ext,
    location
  }
}
