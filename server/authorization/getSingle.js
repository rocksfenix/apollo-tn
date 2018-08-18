import baseResolver from './baseResolver'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from './errors'
import hasValidRole from './hasValidRole'
import models from '../models'

// Regresa un documento buscado por el modelo indicado
// se usa el _id para identificarlo
// Este puede venir como n argumento, de lo contrario lo toma
// de el user.sub
export default ({ model, query, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, args = {}, ctx, info) => {
    const { user } = ctx
    // Si no hay usuario
    if (!user) throw new AuthenticationRequiredError()

    // Validamos la query, puede ser objeto o funcion, dependiendo de esto
    // Es tratada
    // Hacemos una query compuesta pasando los argumentos de entrada

    let _query = {}

    if (typeof query === 'function') { _query = query(args, ctx) }

    if (typeof query === 'object') { _query = query }

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    // De donde tomamos el ID
    const _id = args._id ? args._id : user.sub

    const doc = await models[model].findOne({ ..._query, _id }).populate(populate)

    if (!doc) throw new NotFound()

    // Solo Admin o dueño del recurso
    // Revisamos si el author es un objeto o un String
    const userID = typeof doc.author === 'string'
      ? doc.author
      : doc.author._id

    if (user.role !== 'admin' && userID !== user.sub) throw new ForbiddenError()

    ctx.doc = doc
  }
)
