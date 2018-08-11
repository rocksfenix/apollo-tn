import { withFilter } from 'graphql-subscriptions'
import request from 'request-promise'
import models from '../models'
import auth from '../middlewares/auth'
import { baseResolver } from '../authorization'
import { ValidationError } from '../errors'
import getHash from '../util/getHash'
import pubsub from '../pupsub'

const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_PRIVATE_KEY,
  domain: process.env.MAILGUN_PRIVATE_DOMAIN
})

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET

export default {
  Query: {},

  Mutation: {
    signup: baseResolver.createResolver(async (_, { input }, { req }, info) => {
      // Primero se valida recaptcha para evitar abuso
      const { reCaptchaResponse } = input
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${reCaptchaResponse}&remoteip=${req.connection.remoteAddress}`

      const res = await request(verificationURL)

      if (!JSON.parse(res).success) {
        throw new ValidationError({ data: { field: 'recaptcha', message: 'Recaptcha expired' } })
      }

      // Validar si email ya esta en uso
      const userExist = await models.User.findOne({ email: input.email })

      if (userExist) {
        throw new ValidationError({ data: { field: 'email', message: 'Email ya registrado' } })
      }

      const user = await models.User.create(input)
      const { token, refreshToken } = auth.getTokens(user)

      pubsub.publish('userAccess', {
        userAccess: {
          fullname: user.fullname,
          _id: user._id,
          email: user.email,
          access: 'signup'
        }
      })

      return {
        success: user._id && user,
        token,
        refreshToken,
        errors: []
      }
    }),

    login: async (_, { email, password }) => {
      const user = await models.User.findOne({ email })

      if (!user) {
        return {
          success: false,
          errors: [{
            message: 'El usuario es invalido',
            path: 'user'
          }]
        }
      }

      const isValid = await user.checkPassword(password)

      if (!isValid) {
        return {
          success: false,
          errors: [{
            message: 'Pass invalido',
            path: 'password'
          }]
        }
      }

      const { token, refreshToken } = auth.getTokens(user)

      pubsub.publish('userAccess', {
        userAccess: {
          fullname: user.fullname,
          _id: user._id,
          email: user.email,
          access: 'login'
        }
      })

      return {
        success: true,
        errors: [],
        token,
        refreshToken
      }
    },

    forgot: async (_, { email, reCaptchaResponse, paymentProcess }, { req }) => {
      // 1 - Revisamos Recaptcha
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${reCaptchaResponse}&remoteip=${req.connection.remoteAddress}`

      const res = await request(verificationURL)

      if (!JSON.parse(res).success) {
        // throw new ValidationError({ data: { field: 'recaptcha', message: 'Recaptcha expired' } })
        return {
          success: false,
          message: 'reCAPTCHA Expirada intenta nuevamente'
        }
      }

      // 2 - Validamos demas campos
      const user = await models.User.findOne({ email: email.trim() })

      const _paymentProcess = paymentProcess ? '&paymentProcess=true' : ''

      if (!user) {
        // Enviar informacion a email informando que no se tiene cuenta
        const data = {
          from: 'Tecninja Soporte <tecninja@tecninja.io>',
          to: email,
          subject: 'Recuperar Contraseña de Tecninja.io',
          // text: 'Testing some Mailgun awesomeness!',
          html: `<h4>Hola Ninja</h4>
          <p>Tu email <strong>${email}</strong> No esta registrado en Tecninja, puede ser que hayas utilizado
          algun otro email para tu registro.</p>

          <p>Pueder registrarte en <a href="https://tecninja.io/unete">https://tecninja.io/unete</a></p>
          <p>O contactar con nuestro equipo de soporte <a href="https://tecninja.io/soporte">https://tecninja.io/soporte</a></p>
          <br> El equipo de Tecninja.io ♥
          `
        }
        mailgun.messages().send(data, function (e, body) {
          console.log(e)
          console.log(body)
        })
      } else {
        // Enviar link para resetear
        const hash = await getHash(20)

        user.resetPasswordToken = hash
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        user.resetGetExpired = false

        await user.save()

        // Generamos el JWT para enviar al usuario por email
        // Valido por una hora
        const jwt = auth.getResetPasswordToken(hash)

        const link = `https://${req.headers.host}/recovery?acid=${jwt}${_paymentProcess}`

        const data = {
          from: 'Tecninja Soporte <tecninja@tecninja.io>',
          to: email,
          subject: 'Recuperar Contraseña de Tecninja.io',
          html: `<h4>Hola Ninja ${user.fullname}</h4>
          <p>Alguien solicito tu cambio de contraseña para <strong><a href="https://tecninja.io">tecninja.io</a></strong></p>
          <p>Puedes hacerlo en el siguiente enlace:</p>
          <br>
          <a href='${link}'>${link}</a>
          <br>
          <p>Aun no se ha hecho ningun cambio en tu cuenta, si tienes alguna duda, dejanos
          saber de inmediato. en <a href="https://www.tecninja.io/soporte/">https://www.tecninja.io/soporte/</a>.</p>
          <br> El equipo de Tecninja.io ♥
          `
        }
        mailgun.messages().send(data, function (e, body) {
          console.log(body)
        })
      }

      return {
        success: true,
        message: 'ok'
      }
    },

    recovery: async (_, { email, password, acid, reCaptchaResponse }, { req }) => {
      // 1 - Revisamos Recaptcha
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${reCaptchaResponse}&remoteip=${req.connection.remoteAddress}`

      const res = await request(verificationURL)

      if (!JSON.parse(res).success) {
        throw new ValidationError({ data: { field: 'recaptcha', message: 'Recaptcha expired' } })
      }

      // 2 - Validamos integridad de los campos restantes
      const decode = auth.verifyResetPasswordToken(acid)

      if (decode === 'acid expired') {
        return {
          success: false,
          message: 'acid expired'
        }
      }

      if (decode === 'invalid acid') {
        return {
          success: false,
          message: 'invalid acid'
        }
      }

      // Validamos que exista usuario con email
      const user = await models.User.findOne({ email })

      if (!user) {
        return {
          success: false,
          message: 'Error el email ingresado no es el que registraste con nosotros'
        }
      }

      if (user.resetPasswordToken !== decode.sub) {
        return {
          success: false,
          message: 'Error este link ya fue expirado, solicita otro en tecninja.io/forgot'
        }
      }

      user.password = password
      user.resetPasswordToken = ''
      await user.save()

      // Enviar email de confirmacion
      const data = {
        from: 'Tecninja Soporte <tecninja@tecninja.io>',
        to: email,
        subject: 'Cambio de contraseña de Tecninja.io',
        html: `<h4>Hola ${user.fullname}</h4>
        <p>Tu contraseña en Tecninja.io ha sido actualizada segun tus instrucciones</p>
        </p>Si tienes alguna duda, dejanos saber de inmediato en https://tecninja.io/soporte/.</p>
        <br> El equipo de Tecninja.io ♥
        `
      }

      mailgun.messages().send(data, function (e, body) {
        console.log(body)
      })

      // Enviar respuesta de ok
      return {
        success: true,
        message: 'Password actualizada exitosamente'
      }
    }
  },

  Subscription: {
    userAccess: {
      subscribe: withFilter(() => pubsub.asyncIterator('userAccess'), (payload, variables, ctx) => {
        // Solo usuarios Admin
        return ctx.user.role === 'admin'
      })
    }
  }
}
