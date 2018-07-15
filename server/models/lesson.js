import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'

const screenshotDef = 'https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png'
const videoSource = 'https://player.vimeo.com/video/254234671'

const LessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },

  // Esta propiedad no se cambia, solo se deja de registro ya que sera
  // cambiada o fusionada con el modelo LessonChecked
  isCompleted: { Type: Boolean, default: false },
  title: { type: String, required: [true, 'El titulo es requerido'] },
  description: { type: String, default: 'Una asombrosa leccion...' },
  synopsis: { type: String, default: '' },
  transcription: { type: String, default: '# Tecninja.io' },
  techVersion: { type: String, default: '1.0' },
  lessonVersion: { type: Number, default: 1 },

  type: { type: String, enum: ['snak', 'video', 'liv', 'stepper'], default: 'video' },
  slug: { type: String, slug: 'title', unique: true },
  tech: { type: String, default: 'Javascript' },
  screenshot: {
    small: { type: String, default: screenshotDef },
    medium: { type: String, default: screenshotDef },
    big: { type: String, default: screenshotDef }
  },
  videoSource: { type: String, default: videoSource },
  tags: [{ id: String, text: String }],

  duration: { type: String, default: '4:23' },
  claps: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  role: { type: String, enum: ['pro', 'free', 'public'], default: 'pro' },

  isPublished: { type: Boolean, default: false },
  isTranscriptionPublic: { type: Boolean, default: false }

}, { timestamps: true })

// Plugins
LessonSchema.plugin(uniqueValidator, {message: 'is already taken.'})
LessonSchema.plugin(slugify)

export default mongoose.model('Lesson', LessonSchema)
