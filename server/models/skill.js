import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import slugify from 'slugify-mongoose'
import shortid from 'shortid'

const coverImg = 'https://dxpdcvj89hnue.cloudfront.net/CourseCovers/TecNinja.svg'
const synopsisImg = 'https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png'

const Skillchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },

  title: { type: String, required: [true, 'El titulo es necesario'] },
  slug: { type: String, slug: 'title', unique: true },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  description: { type: String, default: 'Descripcion completa del Skill' },

  isPublished: { type: Boolean, default: false },
  isRecording: { type: Boolean, default: true },

  // Sipnopsis
  synopsis: { type: String, default: 'Con este Skill Aprenderas' },
  videoSynopsis: { type: String, default: '' },
  imageSynopsis: {
    micro: { type: String, default: synopsisImg }, // 60px
    medium: { type: String, default: synopsisImg } // 800px
  },

  category: { type: String, enum: [ 'Frontend', 'Backend', 'Tools' ], default: 'Frontend' },
  mainTech: { type: String, default: 'TecNinja' },
  techs: [{ type: String, default: 'TecNinja' }],

  version: String,
  duration: String,
  role: { type: String, enum: ['pro', 'free', 'public'], default: 'pro' },

  courses: [{ type: String, ref: 'Course' }],
  color: { type: String, default: '#9cb6b5' },
  logo: {
    micro: { type: String, default: coverImg }, // 60px
    small: { type: String, default: coverImg }, // 170px
    medium: { type: String, default: coverImg } // 500px
  }
}, { timestamps: true })

// Plugins
Skillchema.plugin(uniqueValidator, { message: 'Ya existe otro skill con ese nombre' })
Skillchema.plugin(slugify)

export default mongoose.model('Skill', Skillchema)
