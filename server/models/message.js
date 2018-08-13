import mongoose from 'mongoose'
import shortid from 'shortid'

const MessageSchema = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },
  text: {
    type: String,
    required: [true, 'El Text es requerido'],
    maxlength: [2000, 'El nombre debe de tener maximo 2000 caracteres']
  },
  sender: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  receiver: { type: String, ref: 'User', required: [true, 'El Author es requerido'] }

  // Sender Fullname
  // fullname: String
}, { timestamps: true })

export default mongoose.model('Message', MessageSchema)
