import mongoose from 'mongoose'
import shortid from 'shortid'

const FavoriteSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  title: {
    type: String,
    maxlength: [100, 'El nombre debe de tener maximo 100 caracteres']
  },
  text: {
    type: String,
    maxlength: [10000, 'El texto debe de tener maximo 10000 caracteres']
  },
  type: {
    type: String,
    enum: [ 'snippet', 'image' ],
    maxlength: [1000, 'El texto debe de tener maximo 1000 caracteres']
  },
  image: { type: String },
  lesson: { type: String, ref: 'Lesson' },
  course: { type: String, ref: 'Course' }

}, { timestamps: true })

export default mongoose.model('Favorite', FavoriteSchema)
