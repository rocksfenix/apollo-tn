import { createResolver } from 'apollo-resolvers'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from './errors'
import models from './models'

const hasValidRole = ({ only, user }) => {
  if (!only || only.length === 0) throw new Error('only es necesario')
  if (typeof only !== 'string') throw new Error('only debe ser un string')
  // Obtenemos array con los roles permitidos
  const roles = only.split(' ')

  // Validamos que el usuario tenga rol permitido
  const hasRoleValid = roles.filter(r => r === user.role)[0]

  if (!hasRoleValid) return false

  return true
}

export const baseResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
   Only mask outgoing errors that aren't already apollo-errors,
   such as ORM errors etc
 */
  (root, args, context, error) => error
)

export const isAuthenticated = baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  (root, args, { userId }, info) => {
    // if (!userId) throw new Error('No autenticado')
  }
)

// Valida que los recursos debueltos unicaente sean los propios
// validado con author
export const GetSelf = ({ model, query, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, args, ctx, info) => {
    const { user } = ctx
    // Si no hay usuario
    if (!user) throw new AuthenticationRequiredError()

    // Validamos la query, puede ser objeto o funcion, dependiendo de esto
    // Es tratada
    // Hacemos una query compuesta pasando los argumentos de entrada

    let _query = {}

    if (typeof query === 'function') {
      _query = query(args, ctx)
    }

    if (typeof query === 'object') {
      _query = query
    }

    console.log('query', _query)

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    const doc = await models[model].find({ ..._query, author: user._id }).populate(populate)
    ctx.doc = doc
  }
)

export const CreateSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, args, ctx, info) => {
    const { user } = ctx
    // Si no hay usuario
    if (!user) throw new AuthenticationRequiredError()

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    let doc = await models[model].create({ ...args.input, author: user._id })

    if (populate) {
      doc = await models[model].findOne(doc).populate(populate)
    }
    ctx.doc = doc
  }
)

export const DeleteSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
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

    if (user.role !== 'admin' && userID !== user._id) throw new ForbiddenError()

    await doc.remove()

    // Pasamos por contexto el documento
    ctx.doc = doc
  }
)

export const UpdateSelf = ({ model, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, { input }, ctx) => {
    const { user } = ctx
    if (!user) throw new AuthenticationRequiredError()

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    const doc = await models[model].findById(input._id).populate(populate)

    if (!doc) throw new NotFound()

    // Solo Admin o dueño del recurso
    // Revisamos si el author es un objeto o un String
    const userID = typeof doc.author === 'string'
      ? doc.author
      : doc.author._id

    if (user.role !== 'admin' && userID !== user._id) throw new ForbiddenError()

    // Se actualiza
    Object.keys(input).forEach(key => {
      doc[key] = input[key]
    })

    await doc.save()

    // Pasamos por contexto el documento
    ctx.doc = doc
  }
)

export const GetAll = ({ model, query, only, populate = '' }) => baseResolver.createResolver(
  // Extract the userId from context (undefined if non-existent)
  async (root, args, ctx, info) => {
    const { user } = ctx
    // Si no hay usuario
    if (!user) throw new AuthenticationRequiredError()

    // Validamos la query, puede ser objeto o funcion, dependiendo de esto
    // Es tratada
    // Hacemos una query compuesta pasando los argumentos de entrada

    let _query = {}

    if (typeof query === 'function') {
      _query = query(args, ctx)
    }

    if (typeof query === 'object') {
      _query = query
    }

    // Revisamos roles
    if (!hasValidRole({ only, user })) throw new ForbiddenError()

    const doc = await models[model].find({ ..._query }).populate(populate)
    ctx.doc = doc
  }
)
// Regresa un documento buscado por el modelo indicado
// se usa el _id para identificarlo
// Este puede venir como n argumento, de lo contrario lo toma
// de el user._id
export const GetSingle = ({ model, query, only, populate = '' }) => baseResolver.createResolver(
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
    const _id = args._id ? args._id : user._id

    const doc = await models[model].findOne({ ..._query, _id }).populate(populate)

    if (!doc) throw new NotFound()

    // Solo Admin o dueño del recurso
    // Revisamos si el author es un objeto o un String
    const userID = typeof doc.author === 'string'
      ? doc.author
      : doc.author._id

    if (user.role !== 'admin' && userID !== user._id) throw new ForbiddenError()

    ctx.doc = doc
  }
)
