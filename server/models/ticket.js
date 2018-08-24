import mongoose from 'mongoose'
import shortid from 'shortid'

const TicketSchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },
  text: {
    type: String,
    required: [true, 'El Text es requerido'],
    maxlength: [10000, 'El nombre debe de tener maximo 10000 caracteres']
  },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  customer: { type: String, ref: 'User', required: [true, 'El Customer es requerido'] },
  status: { type: String, enum: ['new', 'working', 'completed'], default: 'new' },
  priority: { type: String, enum: ['low', 'normal', 'urgent'], default: 'normal' },
  category: { type: String, enum: ['billing', 'bugg', 'content', 'legal', 'other'], default: 'other' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Ticket', TicketSchema)
