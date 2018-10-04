import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'

const coverImg = 'https://dxpdcvj89hnue.cloudfront.net/CourseCovers/TecNinja.svg'
const synopsisImg = 'https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png'

const CourseSchema = new mongoose.Schema({
  __typename: { type: String, default: 'Course' },
  _id: { type: String, 'default': shortid.generate },

  title: { type: String, required: [true, 'El titulo es necesario'] },
  slug: { type: String, slug: 'title', unique: true },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  description: { type: String, default: 'Descripcion completa del curso' },

  isPublished: { type: Boolean, default: false },
  isRecording: { type: Boolean, default: true },

  serieType: { type: String, enum: ['course', 'tutorial'], default: 'course' },

  // Sipnopsis
  synopsis: { type: String, default: 'En este curso aprenderas los fundamentos de React y como integrarlo a nuestro stack' },
  trailer: { type: String, default: 'http://' },

  imageSynopsis: {
    micro: { type: String, default: synopsisImg }, // 60px
    medium: { type: String, default: synopsisImg } // 800px
  },

  level: {
    type: String,
    enum: [ 'basico', 'intermedio', 'avanzado' ],
    default: 'intermedio'
  },

  // Revisar--------------------------------------
  firstLessonSlug: { type: String, default: '' },

  category: { type: String, enum: [ 'frontend', 'backend', 'herramientas' ], default: 'frontend' },
  tags: [String],
  tech: { type: String, default: 'TecNinja' },
  version: { type: Number, default: 1 },
  techVersion: { type: String, default: '0.0.1' },
  duration: { type: String, default: '124' },
  role: { type: String, enum: ['pro', 'free', 'public'], default: 'pro' },

  lessons: [{ type: String, ref: 'Lesson' }],
  color: { type: String, default: '#9cb6b5' },
  cover: {
    s30: { type: String, default: coverImg },
    s50: { type: String, default: coverImg },
    s100: { type: String, default: coverImg },
    s300: { type: String, default: coverImg },
    s500: { type: String, default: coverImg },
    s800: { type: String, default: coverImg },
    s1000: { type: String, default: coverImg }
  }
}, { timestamps: true })

CourseSchema.index({ title: 'text', tech: 'text', category: 'text', description: 'text' })

// Plugins
CourseSchema.plugin(uniqueValidator, { message: 'is already taken.' })
CourseSchema.plugin(slugify)

CourseSchema.methods.getByRole = function (userRole) {
  let lessons = []

  lessons = this.lessons.map(l => l.getByRole(userRole))

  if (userRole !== 'admin') {
    // Filtramos por publicadas
    lessons = lessons.filter(l => l.isPublished)
  }

  let fields = {};

  [
    '_id',
    'title',
    'slug',
    'author',
    'serieType',
    'trailer',
    'techVersion',
    'description',
    'isPublished',
    'isRecording',
    'synopsis',
    'videoSynopsis',
    'imageSynopsis',
    'level',
    'firstLessonSlug',
    'category',
    'tags',
    'tech',
    'version',
    'duration',
    'role',
    'color',
    'cover',
    'createdAt',
    'updatedAt'
  ].forEach(field => {
    fields[field] = this[field]
  })

  return { ...fields, lessons }
}

export default mongoose.model('Course', CourseSchema)
