import { AuthenticationRequiredError, ForbiddenError, NotFound } from './errors'
import hasValidRole from './hasValidRole'
import models from '../models'
import baseResolver from './baseResolver'

const UpdateSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, { input }, ctx) => {
    const { user } = ctx
    if (!user) throw new AuthenticationRequiredError()

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    // Se busca el documento por su ID
    const doc = await models[model].findById(input._id).populate(populate)

    if (!doc) throw new NotFound()

    // Solo Admin o dueño del recurso
    // Revisamos si el author es un objeto o un String
    const userID = typeof doc.author === 'string'
      ? doc.author
      : doc.author._id

    console.log(userID, user.sub)
    // Revisar para todos, ahora no se popula el user en req.user
    // por lo que se debe de buscar como user.sub
    if (user.role !== 'admin' && userID !== user.sub) throw new ForbiddenError()

    // Se actualiza cada llave
    Object.keys(input).forEach(key => {
      doc[key] = input[key]
    })

    await doc.save()

    // Pasamos por contexto el documento
    ctx.doc = doc
  }
)

export default UpdateSelf
