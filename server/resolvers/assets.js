import { GraphQLUpload } from 'apollo-upload-server'
import { NotFound, ForbiddenError } from '../errors'
import uploadAsset from '../util/upload-asset'
import models from '../models'

export default {
  Upload: GraphQLUpload,
  Query: {
    assets: async (_, { first, skip, text }, { req: { user } }) => {
      // TODO separar isPublished para role !== admin
      let limit = first <= 100 ? first : 100
      const _text = text ? new RegExp(text, 'i') : null
      let query = {}

      if (_text) {
        query = {
          $or: [
            {filename: { $regex: _text, $options: 'i' }}
          ]
        }
      }

      const assets = await models.Asset.find(query).limit(limit).skip(skip).sort({ createdAt: -1 })
      let total = assets.length

      // SI no hay consulta de texto, el total es el total absoluto
      if (!_text) {
        total = await models.Course.count()
      }

      return {
        assets,
        total
      }
    }
  },

  Mutation: {
    assetUpload: async (_, { file }, { req: { user } }) => {
      const { filename, mimetype } = await file

      const { type, location, size, thumbnail, ext } = await uploadAsset(file, 'assets')

      if (type === 'image') {
        const asset = models.Asset.create({
          type: 'image',
          filename,
          mimetype,
          size,
          location,
          ext,
          thumbnail,
          author: user.sub
        })
      }

      if (type === 'file') {
        const asset = models.Asset.create({
          type: 'file',
          filename,
          mimetype,
          size,
          ext,
          location,
          author: user.sub
        })
      }

      return 'ok'
    },
    assetDelete: async () => {

    }
  }
}
