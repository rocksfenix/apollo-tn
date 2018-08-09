import mongoose from 'mongoose'
import shortid from 'shortid'

const AssetSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  type: {
    type: String,
    enum: [ 'image', 'file' ]
  },
  filename: String,
  mimetype: String,
  location: String,
  ext: String,
  size: Number,
  thumbnail: {
    s30: String,
    s50: String,
    s100: String
  }

}, { timestamps: true })

AssetSchema.index({ filename: 'text' })

export default mongoose.model('Asset', AssetSchema)
