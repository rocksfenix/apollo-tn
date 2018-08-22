import Redis from 'ioredis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

const REDIS_HOST = process.env.REDIS_HOST

const pubsub = new RedisPubSub({
  publisher: new Redis(REDIS_HOST),
  subscriber: new Redis(REDIS_HOST)
})

export default pubsub
