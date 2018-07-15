import uid from 'uid'
import _ from 'lodash'

// Store de tokens validos
let requestTokens = []

const getToken = (length = 24) => {
  return `${uid(8)}-${uid(8)}-${uid(8)}-${uid(8)}-${uid(8)}-${uid(8)}`
}

const createToken = (req) => {
  try {
    const token = getToken()
    requestTokens.push(token)
    console.log('TOKEN GENERADO', token, req.headers['user-agent'])
    return token
    // if (req.headers['user-agent'] === 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)') {
    //   const token = getToken()
    //   requestTokens.push(token)
    //   console.log('TOKEN GENERADO', token)
    //   return token
    // }
  } catch (error) {
    console.log('Error al generar Token x-xoxo')
    throw new Error(error)
  }
}

const checkToken = (req) => {
  // si no es fetch unetch-node
  // 'user-agent': 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
  if (req.headers['user-agent'] !== 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)') {
    return false
  }

  // Si contiene Cookies la solciitud no es de Node si no de un navegador
  if (Object.keys(req.cookies).length) {
    return false
  }

  const token = req.headers['x-xoxo']
  // Revisamos que el x-xoxo este definido
  if (!token) {
    return false
  }

  // Revisamos que este contenido
  if (!_.includes(requestTokens, token)) {
    return false
  }
  // console.log(token, requestTokens)

  // Paso las pruebas
  if (requestTokens.length >= 5) {
    requestTokens = []
  } else {
    requestTokens = requestTokens.filter(t => t !== token)
  }

  console.log('requestTokens >>', requestTokens.filter(t => t !== token))

  return true
}

// Exportamos por defecto el Midleware
export default (req, res, next) => {
  req.getXoxoToken = createToken
  req.checkXoxoToken = checkToken
  next()
}
