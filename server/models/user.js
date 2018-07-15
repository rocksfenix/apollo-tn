import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'
import { isEmail } from 'validator'
import { generateUsername } from 'username-generator'

const avatarDefault = 'https://dxpdcvj89hnue.cloudfront.net/images/avatar-tecninja.io.svg'

const UserSchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },
  // el author es igual a _id lo almacenamos tambien en id par avali
  author: { type: String },

  // DATOS PERSONALES PRIVILEGIADOS rgpd
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [ true, 'No puede estar es blanco' ],
    validate: [ isEmail, 'El email ingresado en invalido' ],
    maxlength: [100, 'El email debe de tener maximo 100 caracteres'],
    index: true
  },
  fullname: {
    type: String,
    required: [ true, 'No puede estar en blanco' ],
    minlength: [3, 'El nombre debe tener minimo 3 Letras'],
    maxlength: [100, 'El nombre debe de tener maximo 100 caracteres'],
    trim: true,
    index: true
  },
  slug: { type: String, slug: 'fullname', unique: true, index: true },
  username: {
    type: String,
    default: generateUsername
  },
  bio: String,
  avatar: {
    micro: { type: String, default: avatarDefault },
    small: { type: String, default: avatarDefault },
    medium: { type: String, default: avatarDefault }
  },
  // Eliminar posiblemente
  availableToHire: { type: Boolean, default: false },
  showEmail: { type: Boolean, default: false },
  // Fecha de ultimo login
  lastLoggin: { type: Date, default: Date.now },
  lastLogginIp: { type: String, default: '' },
  // Payments
  stripeId: String,
  subscriptionStatus: { type: String, enum: [ 'active', 'pastDue' ] },
  subscriptionId: String,
  canceled_at: { type: Number, default: 1518380759 },
  cancel_at_period_end: { type: Boolean, default: false },
  current_period_end: { type: Number, default: 1518380759 },
  defaultCard: {
    brand: String,
    country: String,
    last4: String
  },

  // Fecha de aceptacion de politica de Privacidad
  acceptPolicyPrivacy: { type: Boolean, default: false },
  acceptPolicyPrivacyDate: { type: Date },
  acceptTermsAndConditions: { type: Boolean, default: false },
  acceptTermsAndConditionsDate: { type: Date },

  authProvider: { type: String, enum: [ 'facebook', 'twitter', 'email' ], default: 'email' },
  password: { type: String, minlength: [8, 'La contraseña debe tener minimo 8 caracteres'], required: [true, 'No puede estar en blanco'] },
  role: {
    type: String,
    enum: [ 'admin', 'pro', 'free' ],
    required: true,
    default: 'free'
  },

  activeToken: String,
  // preferences: {
  //   notifications: {
  //     newCourse: { type: Boolean, default: false },
  //     newLesson: { type: Boolean, default: true }
  //   }
  // },
  avatarCache: { type: String, default: 'def' },

  status: {
    type: String,
    enum: ['active', 'hold'],
    default: 'active'
  },

  tags: [String],
  // Revisar esta seccion
  lastActivity: { type: String, default: 'Welcome Ninja Dev' },

  // Hooks Marketing y estadistica
  // Veces que ha accedido a pagina /pro
  countViewPro: { type: Number, default: 0 },
  // Veces que ha accedido a pagina /suscribete
  countViewSub: { type: Number, default: 0 },
  // Cuando intenta pagar y la tarjeta es invalida o no se acepta el pago
  countAttemptsPaymentFailed: { type: Number, default: 0 },

  // Confirmacion de emails
  emailConfirmed: { type: Boolean, default: false },
  emailConfirmToken: { type: String },
  emailConfirmTokenExpires: Date,

  // Reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetIntegrity: String,
  resetGetExpired: { type: Boolean, default: true }
}, { timestamps: true })

UserSchema.plugin(uniqueValidator, { message: 'Ya esta esta en uso' })
UserSchema.plugin(slugify)

UserSchema.pre('save', function (next) {
  let user = this

  // Actualizamos el auhtor
  user.author = user._id

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next()

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.checkPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, res) {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

export default mongoose.model('User', UserSchema)
