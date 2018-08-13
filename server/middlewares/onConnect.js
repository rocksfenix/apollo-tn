// Este modulo maneja la misma logia que ./auth
// pero para conecciones de sockets
// se usa al generar una coneccion de Graphql Subscriptions

import jwt from 'jsonwebtoken'
import models from '../models'
import auth from './auth'
import agents from '../agents'

const JWT_SECRET = process.env.JWT_SECRET

export default async ({ token, refreshToken }, webSocket) => {
  console.log(`
  SOCKET: ${token}
  `)

  if (!token || !refreshToken) return {}
  try {
    const user = jwt.verify(token, JWT_SECRET)
    // Agregamos a agents si es admin
    if (user.role === 'admin') agents.add(user.sub)
    return { user }
  } catch (e) {
    // TOKEN EXPIRED
    if (e.message === 'jwt expired') {
      // Obtenemos el dueño del token
      const e = await jwt.decode(token)
      const user = await models.User.findById(e.sub)
      // Si algun haker ingreso un sub con un id invalido
      // De algun usuario que no exista
      if (!user) return {}

      // Si no envia RefreshToken
      // Creamos un nuevo token pero validamos que el Refresh Token este vigente
      try {
        jwt.verify(refreshToken, JWT_SECRET)

        const newToken = auth.getToken(user)
        const _user = await jwt.decode(newToken)

        // Agregamos a agents si es admin
        if (_user.role === 'admin') agents.add(_user.sub)

        return { user: _user }
      } catch (error) {
        // Enviar encavesado de session expirada para hacer
        // un logout en automatico en el cliente
        // redireccionar a /?sessionExired=true
        if (error.message === 'jwt expired') {
          console.log('SESION EXPIRADA SOCKET')
          return {}
        }
      }
    }
  }
}
