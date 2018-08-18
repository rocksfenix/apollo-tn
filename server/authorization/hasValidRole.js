/**
 * Revisa que el role que llega por el req.uter resultado
 * del Middleware de auth contecnga un role valido
 * @param {string} only - Roles autorizados separados por espacios ex. 'admin member pro'
 * @param {user} - Objeto con el usuario que llega de decodificar el JWT
 * @returns {boolean}
 */
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

export default hasValidRole
