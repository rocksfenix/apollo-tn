// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import models from '../models'
import Constants from '../../config'
const JWT_SECRET = process.env.JWT_SECRET
const { JWT_KEY, JWT_RFS_KEY, JWT_REHYDRATE_KEY } = Constants

// EL filtro de auth pasa por 3 etapas
// Si el token es valido, si expiro y fue remplazado
// si es valido identifica el role
// TODO Hacer el refreshtoken y que este en sinctronizacion y que funciuone
const auth = {
  checkHeaders: async (req, res, next) => {
    const jwtToken = req.headers[JWT_KEY]
    const jwtRfs = req.headers[JWT_RFS_KEY]

    if (!jwtRfs || !jwtToken) return next()

    if (jwtToken) {
      try {
        const user = jwt.verify(jwtToken, JWT_SECRET)
        req.user = user
      } catch (e) {
        // TOKEN EXPIRED
        if (e.message === 'jwt expired') {
          // Obtenemos el dueño del token
          const e = await jwt.decode(jwtToken)
          const user = await models.User.findById(e.sub)
          // Si algun haker ingreso un sub con un id invalido
          // De algun usuario que no exista
          if (!user) {
            req.user = null
            return next()
          }

          // Si no envia RefreshToken
          // Creamos un nuevo token pero validamos que el Refresh Token este vigente
          try {
            jwt.verify(jwtRfs, JWT_SECRET)
            // Token valido, creamos nuevo JWT
            // Con el estado de la ultima informacion  de la DB
            const newToken = auth.getToken(user)
            // console.log('NUEVO TOKEN ', newToken)
            // res.set('Access-Control-Expose-Headers', JWT_KEY)
            res.set(JWT_REHYDRATE_KEY, newToken)
            // Pasamos la info decodificada al user
            req.user = await jwt.decode(newToken)
          } catch (error) {
            // Enviar encavesado de session expirada para hacer
            // un logout en automatico en el cliente
            // redireccionar a /?sessionExired=true
            if (error.message === 'jwt expired') {
              console.log('SESION EXPIRADA')
              // req.user = null
              res.set('x-tn-expired-session', 'true')
              // next()
            }
          }
        }
      }
    }
    next()
  },

  getTokens: (user) => ({
    token: auth.getToken(user),
    refreshToken: auth.getRefreshToken(user)
  }),

  getToken: ({ _id, role, acceptTermsAndPrivacy, subscriptionStatus }) => {
    const payload = {
      sub: _id,
      role,
      acpp: acceptTermsAndPrivacy,
      subst: subscriptionStatus
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '10s' })
  },

  getRefreshToken: ({ _id }) => {
    const payload = { sub: _id }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' })
  },

  getResetPasswordToken: (sub) => {
    return jwt.sign({
      sub
    }, JWT_SECRET + '-recvgter', { expiresIn: '1h' })
  },

  // Valida el reseteo de password
  verifyResetPasswordToken: (token) => {
    try {
      const decode = jwt.verify(token, JWT_SECRET + '-recvgter')
      return decode
    } catch (error) {
      if (error.message === 'jwt expired') {
        return 'acid expired'
      }
      return 'invalid acid'
    }
  }
}

export default auth
