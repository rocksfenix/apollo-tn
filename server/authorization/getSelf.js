import baseResolver from './baseResolver'
import { AuthenticationRequiredError, ForbiddenError } from './errors'
import hasValidRole from './hasValidRole'
import models from '../models'

/**
 * Valida que los recursos retornados unicaente sean los propios
 * Validando el author del documento contra el que llega por JWT
 * El resultado de la operacion se pasa por el context
 *
 * @param {string} model - Modelo pasado ex 'User'
 * @param {object|funcion} query - Podemos hacer una consulta pasando un objeto o una funcion
 * @param {string} only - Cadena con roles permitidos separados por espacios
 * @param {string} populate - Poblacion de mongoose
 */
const getSelf = ({ model, query, only, populate = '' }) => baseResolver.createResolver(
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

    const doc = await models[model].find({ ..._query, author: user.sub }).populate(populate)
    ctx.doc = doc
  }
)

export default getSelf
