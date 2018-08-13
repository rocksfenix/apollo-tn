import cookie from 'cookie'
import agents from '../agents'

import jwt from 'jsonwebtoken'
import Constants from '../../config'
const { JWT_KEY } = Constants

export default async (webSocket, context) => {
  const cookies = cookie.parse(context.request.headers.cookie)

  const user = jwt.decode(cookies[JWT_KEY])

  if (user.role === 'admin') {
    agents.remove(user.sub)
  }

  console.log('DISCONECT******************************', cookies)
}
