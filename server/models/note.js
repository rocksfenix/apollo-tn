import mongoose from 'mongoose'
import shortid from 'shortid'

const NoteSchema = new mongoose.Schema({
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

  time: { type: Number, default: 0 },
  // # Posiblemente se valla a cambiar por rendimiento
  lesson: { type: String, ref: 'Lesson' },
  course: { type: String, ref: 'Course' },
  tags: [String]

}, { timestamps: true })

NoteSchema.index({ text: 'text' })

export default mongoose.model('Note', NoteSchema)
