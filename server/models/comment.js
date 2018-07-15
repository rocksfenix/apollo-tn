import mongoose from 'mongoose'
import shortid from 'shortid'

const CommentSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  text: {
    type: String,
    required: [true, 'El Text es requerido'],
    maxlength: [10000, 'El nombre debe de tener maximo 10000 caracteres']
  },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  lesson: { type: String, ref: 'Lesson', required: [true, 'La leccion es requerida'] }

}, { timestamps: true })

export default mongoose.model('Comment', CommentSchema)
