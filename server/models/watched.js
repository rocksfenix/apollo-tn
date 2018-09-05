import mongoose from 'mongoose'
import shortid from 'shortid'

const Watched = new mongoose.Schema({
  _id: { type: String, 'default': shortid.generate },
  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },
  lesson: { type: String, ref: 'Lesson', required: [true, 'El Lesson es requerido'] },
  course: { type: String, ref: 'Course', required: [true, 'El Course es requerido'] },
  tech: { type: String, required: [true, 'La Tech es requerida'] },
  lessonTitle: { type: String, required: [true, 'La lessonTitle es requerido'] },
  courseTitle: { type: String, required: [true, 'La courseTitle es requerido'] },
  courseSlug: { type: String, required: [true, 'La courseSlug es requerido'] },
  lessonSlug: { type: String, required: [true, 'La lessonSlug es requerido'] },
  watchedAt: { type: Date, default: Date.now }
})

Watched.index({
  author: 1,
  lesson: 1,
  course: 1
})

export default mongoose.model('Watched', Watched)
