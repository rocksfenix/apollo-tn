import { GraphQLUpload } from 'apollo-upload-server'
import { AuthenticationRequiredError, ForbiddenError } from '../authorization/errors'
import uploadAsset from '../util/upload-asset'
import models from '../models'

export default {
  Upload: GraphQLUpload,
  Query: {
    assets: async (_, { first, skip, text }, { req: { user } }) => {
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

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

      const assets = await models.Asset
        .find(query)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

      let total = assets.length

      // Si no hay consulta de texto, el total de la coleccion
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
      if (!user) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const { filename, mimetype } = await file
      const { type, location, size, thumbnail, ext } = await uploadAsset(file, 'assets')

      if (type === 'image') {
        await models.Asset.create({
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
        await models.Asset.create({
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
      // TODO
    }
  }
}
