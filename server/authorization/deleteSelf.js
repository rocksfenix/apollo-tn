import { AuthenticationRequiredError, ForbiddenError, NotFound } from './errors'
import hasValidRole from './hasValidRole'
import models from '../models'
import baseResolver from './baseResolver'

const DeleteSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, { _id }, ctx) => {
    const { user } = ctx
    if (!user) throw new AuthenticationRequiredError()

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    const doc = await models[model].findById(_id).populate(populate)

    if (!doc) throw new NotFound()

    // Solo Admin o dueño del recurso
    // Revisamos si el author es un objeto o un String
    const userID = typeof doc.author === 'string'
      ? doc.author
      : doc.author._id

    if (user.role !== 'admin' && userID !== user.sub) throw new ForbiddenError()

    await doc.remove()

    // Pasamos por contexto el documento
    ctx.doc = doc
  }
)

export default DeleteSelf
