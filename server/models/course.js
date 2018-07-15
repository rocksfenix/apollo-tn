import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'

const coverImg = 'https://dxpdcvj89hnue.cloudfront.net/CourseCovers/TecNinja.svg'
const synopsisImg = 'https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png'

const CourseSchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },

  title: { type: String, required: [true, 'El titulo es necesario'] },
  slug: { type: String, slug: 'title', unique: true },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  description: { type: String, default: 'Descripcion completa del curso' },

  isPublished: { type: Boolean, default: false },
  isRecording: { type: Boolean, default: true },

  // Sipnopsis
  synopsis: { type: String, default: 'En este curso aprenderas los fundamentos de React y como integrarlo a nuestro stack' },
  videoSynopsis: { type: String, default: '...' },
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
  seeLater: { Type: Boolean, default: false },

  category: { type: String, enum: [ 'Frontend', 'Backend', 'Tools' ], default: 'Frontend' },
  tags: [{ id: String, text: String }],
  tech: { type: String, default: 'TecNinja' },
  version: String,
  duration: String,
  role: { type: String, enum: ['pro', 'free', 'public'], default: 'pro' },

  lessons: [{ type: String, ref: 'Lesson' }],
  color: { type: String, default: '#9cb6b5' },
  cover: {
    micro: { type: String, default: coverImg }, // 60px
    small: { type: String, default: coverImg }, // 170px
    medium: { type: String, default: coverImg }, // 500px
    large: { type: String, default: coverImg } // 1000px
  }
}, { timestamps: true })

// Plugins
CourseSchema.plugin(uniqueValidator, { message: 'is already taken.' })
CourseSchema.plugin(slugify)

export default mongoose.model('Course', CourseSchema)
