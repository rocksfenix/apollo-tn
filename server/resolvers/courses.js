import models from '../models'
import { CreateSelf, DeleteSelf } from '../authorization'
// AuthenticationRequiredError, ForbiddenError,
import { NotFound } from '../errors'
import { GraphQLUpload } from 'apollo-upload-server'
import uploadImage from '../upload-image'

// const uploadDir = './uploads'
// // Ensure upload directory exists
// mkdirp.sync(uploadDir)

// const storeFS = ({ stream, filename }) => {
//   const id = shortid.generate()
//   const path = `${uploadDir}/${id}-${filename}`
//   return new Promise((resolve, reject) =>
//     stream
//       .on('error', error => {
//         if (stream.truncated) {
//         // Delete the truncated file
//           fs.unlinkSync(path)
//         }
//         reject(error)
//       })
//       .pipe(fs.createWriteStream(path))
//       .on('error', error => reject(error))
//       .on('finish', () => resolve({ id, path }))
//   )
// }

// const processUpload = async upload => {
//   const { stream, filename, mimetype, encoding } = await upload
//   const { id, path } = await storeFS({ stream, filename })
//   return ({ id, filename, mimetype, encoding, path })
// }

export default {
  Upload: GraphQLUpload,
  Query: {
    allCourses: async (_, { first, skip = 0, text }, { user = {} }) => {
      // TODO separar isPublished para role !== admin
      let limit = first <= 100 ? first : 100
      const _text = text ? new RegExp(text, 'i') : null
      let query = {}

      if (_text) {
        query = {
          $or: [
            {title: { $regex: _text, $options: 'i' }},
            {description: { $regex: _text, $options: 'i' }},
            {tech: { $regex: _text, $options: 'i' }}
          ]
        }
      }

      const courses = await models.Course.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
      let total = courses.length

      // SI no hay consulta de texto, el total es el total absoluto
      if (!_text) {
        total = await models.Course.count()
      }

      return {
        courses,
        total
      }
    },

    courses: async (_, args, { user = {} }) => {
      const role = user.role ? user.role : 'public'
      let query = role !== 'admin' ? { isPublished: true } : {}
      let courses = await models.Course.find(query).populate('author lessons')

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return courses.map(c => c.getDataByRole(role))
      }

      return courses
    },

    course: async (_, { slug }, { user = {} }) => {
      // TODO al obtener el curso obtener si el usuaro ya tiene lecciones
      // vistas de ese curso y señalizar
      const role = user.role ? user.role : 'public'

      let query = { slug }

      if (role !== 'admin') {
        query.isPublished = true
      }

      let course = await models.Course.findOne(query).populate('author lessons')

      // # TODO Si no es admin unicamente enviar los cursos isPublished
      if (role !== 'admin') {
        return course.getDataByRole(role)
      }

      return course
    }
  },

  Mutation: {
    courseCreate: CreateSelf({
      model: 'Course',
      populate: 'author',
      only: 'admin'
    }).createResolver((_, args, { doc }) => doc),

    courseUpdate: async (_, { input }, { doc }) => {
      const course = await models.Course.findById(input._id) // .populate('author lessons')

      if (!course) throw new NotFound()

      Object.keys(input).forEach(key => {
        course[key] = input[key]
      })

      await course.save()

      const coursePopulate = await models.Course.populate(course,
        { path: 'lessons', model: 'Lesson' }
      )
      // popular las lecciones
      return coursePopulate
    },

    courseDelete: DeleteSelf({
      model: 'Course',
      only: 'admin',
      populate: 'author lessons'
    })
      .createResolver((_, args, { doc }) => doc),

    uploadCover: async (obj, { file, courseSlug }) => {
      const course = await models.Course.findOne({ slug: courseSlug })

      if (!course) throw new NotFound()

      // Pasamos 3 valores, el file, un array con los tamaños y el folder S3
      // cover.s800
      const sizes = [
        { size: 30, suffix: 's30' },
        { size: 50, suffix: 's50' },
        { size: 100, suffix: 's100' },
        { size: 300, suffix: 's300' },
        { size: 500, suffix: 's500' },
        { size: 800, suffix: 's800' }
      ]

      const cover = await uploadImage(file, sizes, 'cover')

      console.log('CURSO SLUIG: ' + courseSlug, cover)
      course.cover = cover

      await course.save()

      return 'ok'
    }
  }
}
