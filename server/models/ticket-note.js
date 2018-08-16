import mongoose from 'mongoose'
import shortid from 'shortid'

const TicketNoteSchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },
  text: {
    type: String,
    required: [true, 'El Text es requerido'],
    maxlength: [10000, 'El nombre debe de tener maximo 10000 caracteres']
  },
  ticket: { type: String, ref: 'Ticket', required: [true, "can't be blank"] },
  author: { type: String, ref: 'User', required: [true, "can't be blank"] }
}, { timestamps: true })

export default mongoose.model('TicketNote', TicketNoteSchema)
