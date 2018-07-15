// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import models from '../models'
const JWT_SECRET = process.env.JWT_SECRET

// EL filtro de auth pasa por 3 etapas
// Si el token es valido, si expiro y fue remplazado
// si es valido identifica el role

const auth = {
  checkHeaders: async (req, res, next) => {
    const token = req.headers['_x-jwt']

    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET)
        req.user = user
      } catch (e) {
        // INVALID token
        if (e.message === 'jwt expired') {
          // console.log('Token expirado', e.message)
          const {sub} = await jwt.decode(token)
          const user = await models.User.findById(sub)

          // Si algun haker ingreso un sub con un id invalido
          if (!user) {
            req.user = user
            return next()
          }

          const newToken = auth.getToken(user)
          res.set('Access-Control-Expose-Headers', '_x-jwt')
          res.set('_x-jwt', newToken)
          req.user = user
        }
      }
    } else {
      req.auth = {
        isAuth: false,
        author: null,
        refleshToken: false,
        role: ''
      }
    }
    next()
  },

  // refreshToken: async (token) => {
  //   // Obtenemos el id del usuario
  //   // Lo buscamos en DB
  //   // generamos nuevo token
  //   const {sub} = await jwt.decode(token)
  //   const user = await models.User.findById(sub)
  //   const newToken = auth.getToken(user)
  //   return {
  //     author: user._id,
  //     token: newToken
  //   }
  // },

  getToken: ({ _id, role }) => {
    const payload = {
      sub: _id,
      role
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30s' })
  }

  // login: async (email, password, models) => {
  //   const user = await models.User.findOne({email})

  //   if (!user) {
  //     return {
  //       success: false,
  //       errors: [{path: 'email', message: 'El email no existe'}]
  //     }
  //   }
  //   // .compare(password, user.password)
  //   const verifyPassword = await bcrypt.compare(password, user.password)

  //   if (!verifyPassword) {
  //     return {
  //       success: false,
  //       errors: [{path: 'password', message: 'Pass Invalida'}]
  //     }
  //   }

  //   const token = auth.getToken(user)

  //   console.log(token, verifyPassword, password, user.password, email)

  //   return {
  //     success: true,
  //     token,
  //     errors: []
  //   }
  // }
}

export default auth
