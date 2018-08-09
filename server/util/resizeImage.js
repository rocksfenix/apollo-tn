
const gm = require('gm').subClass({
  imageMagick: true
})

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

export default resizeImg
