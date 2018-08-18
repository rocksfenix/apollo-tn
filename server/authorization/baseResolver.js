import { createResolver } from 'apollo-resolvers'

export const baseResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
   Only mask outgoing errors that aren't already apollo-errors,
   such as ORM errors etc
 */
  (root, args, context, error) => error
)

export default baseResolver
