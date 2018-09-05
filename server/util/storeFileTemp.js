import shortid from 'shortid'
import path from 'path'
import fs from 'fs'

const uploadDir = './uploads'

const storeFileTemp = ({ stream, filename }) => {
  const id = shortid.generate()
  const pathTemp = `${uploadDir}/${id}`
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

export default storeFileTemp
