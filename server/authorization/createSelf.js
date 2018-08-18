import { AuthenticationRequiredError, ForbiddenError } from './errors'
import hasValidRole from './hasValidRole'
import models from '../models'
import baseResolver from './baseResolver'

export const createSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, args, ctx, info) => {
    const { user } = ctx
    // Si no hay usuario
    if (!user) throw new AuthenticationRequiredError()

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    let doc = await models[model].create({ ...args.input, author: user.sub })

    if (populate) {
      doc = await models[model].findOne(doc).populate(populate)
    }
    ctx.doc = doc
  }
)

export default createSelf
