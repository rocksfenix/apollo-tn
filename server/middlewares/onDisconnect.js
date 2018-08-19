import cookie from 'cookie'
import agents from '../agents'
import jwt from 'jsonwebtoken'
import Constants from '../../config'
import pubsub from '../pupsub'
import models from '../models'

const { JWT_KEY } = Constants

const changeUserConnect = async (_id) => {
  const user = await models.User.findById(_id)

  if (!user) return
  user.isConnected = false
  user.connectionDate = Date.now()

  const u = await user.save()

  pubsub.publish('onChangeConnection', {
    onChangeConnection: {
      status: false,
      user: u
    }
  })
}

export default async (webSocket, context) => {
  const cookies = cookie.parse(context.request.headers.cookie)
  const user = jwt.decode(cookies[JWT_KEY])
  changeUserConnect(user.sub, false)
  if (user.role === 'admin') {
    agents.remove(user.sub)
  }
}
