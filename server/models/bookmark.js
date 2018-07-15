import mongoose from 'mongoose'
import shortid from 'shortid'

const bookmarkSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  time: {
    type: Number,
    default: 0
  },

  author: { type: String, ref: 'User', required: [true, 'El Author es requerido'] },

  type: {
    type: String,
    enum: [ 'lesson', 'module', 'course', 'skill' ]
  },

  // duration: { type: Number, default: 0 },
  // courseTitle: String,
  // courseSlug: String,
  // lessonTitle: String,
  // lessonSlug: String,
  // color: String,

  level: {
    type: Number,
    enum: [ 0, 1, 2 ],
    default: 0
  },

  lesson: { type: String, ref: 'Lesson' },
  course: { type: String, ref: 'Course' }

}, { timestamps: true })

export default mongoose.model('Bookmark', bookmarkSchema)
