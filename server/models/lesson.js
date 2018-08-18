import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'

const screenshotDef = 'https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png'
const videoSource = 'https://player.vimeo.com/video/254234671'

const LessonSchema = new mongoose.Schema({

  __typename: { type: String, default: 'Lesson' },
  _id: {
    type: String,
    'default': shortid.generate
  },

  // TODO Revisar de que forma de debe de enlazar
  // con el padre de la leccion
  courseSlug: { type: String, default: '' },

  // Esta propiedad no se cambia, solo se deja de registro ya que sera
  // cambiada o fusionada con el modelo LessonChecked
  isCompleted: { Type: Boolean, default: false },
  isWatched: { Type: Boolean, default: false },
  title: { type: String, required: [true, 'El titulo es requerido'] },
  synopsis: { type: String, default: 'Una asombrosa leccion...' },
  transcription: { type: String, default: '# Tecninja.io' },
  techVersion: { type: String, default: '1.0' },
  lessonVersion: { type: Number, default: 1 },

  type: { type: String, enum: ['snak', 'video', 'liv', 'stepper'], default: 'video' },
  slug: { type: String, slug: 'title', unique: true },
  tech: { type: String, default: 'Javascript' },
  screenshot: {
    s30: { type: String, default: screenshotDef },
    s50: { type: String, default: screenshotDef },
    s100: { type: String, default: screenshotDef },
    s300: { type: String, default: screenshotDef },
    s500: { type: String, default: screenshotDef },
    s800: { type: String, default: screenshotDef },
    s1000: { type: String, default: screenshotDef }
  },
  videoSource: { type: String, default: videoSource },
  tags: [String],

  duration: { type: String, default: '4:23' },
  claps: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  role: { type: String, enum: ['pro', 'free', 'public'], default: 'pro' },

  isPublished: { type: Boolean, default: false },
  isTranscriptionPublic: { type: Boolean, default: false }

}, { timestamps: true })

LessonSchema.index({ title: 'text', tech: 'text', transcription: 'text', synopsis: 'text' })

// Plugins
LessonSchema.plugin(uniqueValidator, {message: 'is already taken.'})
LessonSchema.plugin(slugify)

const MesssageContentPro = (title) => `
# ${title}
<div style="background: #dcffe5;">
  <p>
    <i class="ion-alert-en un círculo" />
      Tienes que ser un suscriptor Pro para ver este contenido.
      <a href="/pro"> Go Pro </a> para obtener:
  </ p>
  <ul style = "margin-top: 20px">
    <li> Acceso ilimitado a todos los cursos & amp; contenido </ li>
    <li> Invita a nuestro canal exclusivo de Slack </ li>
    <li> Cursos de desarrollo de RealWorld completos </ li>
    <li> Sin anuncios </ li>
    <li> Prioridad Q & soporte A </ li>
    <li> Mejores oportunidades de carrera </ li>
    <li> Confianza &amp; experiencia </ li>
    <li> <a href="/pro"> ¡y más! </a> </ li>
  </ ul>
  <p style="margin-top: 20px">
    ¿Ya estás suscrito a Pro? <a href="/login"> Iniciar sesión </a>
  </ p>
</ div>
`

LessonSchema.methods.getDataByRole = function (userRole) {
  console.log(userRole)
  // Solo debemos proteger 2 cosas
  // * La transcripcion
  // * El video Source
  let transcription = this.isTranscriptionPublic
    ? this.transcription
    : MesssageContentPro(this.title)

  let videoSource = ''

  // Limitamos el Acceso autorizado
  if (userRole === 'pro' || userRole === 'admin') {
    // En usuario PRO o admin si enviamos esta informacion
    transcription = this.transcription
    videoSource = this.videoSource
  }

  // Si la leccion es Free y es member free
  if (userRole === 'free' && this.role === 'free') {
    videoSource = this.videoSource
  }

  // Leccion publica
  if (this.role === 'public') {
    videoSource = this.videoSource
  }

  let fields = {};

  [
    '_id',
    'title',
    'slug',
    'author',
    'synopsis',
    'techVersion',
    'lessonVersion',
    'type',
    'tech',
    'screenshot',
    'tags',
    'duration',
    'claps',
    'role',
    'isPublished',
    'isTranscriptionPublic',
    'createdAt',
    'updatedAt'
  ].forEach(field => {
    fields[field] = this[field]
  })

  return { ...fields, transcription, videoSource }
}

export default mongoose.model('Lesson', LessonSchema)
