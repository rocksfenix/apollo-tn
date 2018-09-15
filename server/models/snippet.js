import mongoose from 'mongoose'
import shortid from 'shortid'

const SnippetSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  lang: { type: String, required: [true, 'El lang es requerido'] },
  tech: { type: String, default: 'javascript' },
  filename: { type: String, required: [true, 'El filename es requerido'] },
  code: {
    type: String,
    required: [true, 'El Text es requerido'],
    maxlength: [20000, 'Los snippets deben de tener maximo 20000 caracteres']
  },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  lessonTitle: { type: String, required: [true, 'El lessonTitle es requerido'] },
  courseTitle: { type: String, required: [true, 'El courseTitle es requerido'] },
  lessonSlug: { type: String, required: [true, 'El lessonSlug es requerido'] },
  courseSlug: { type: String, required: [true, 'El courseSlug es requerido'] }
}, { timestamps: true })

export default mongoose.model('Snippet', SnippetSchema)
