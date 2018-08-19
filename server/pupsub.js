// import { PubSub } from 'graphql-subscriptions'
import redis from 'redis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

const client = redis.createClient({
  url: 'redis://h:KbZ2EFlItNMRBm1mgxed4B96mjzgobIm@redis-17932.c8.us-east-1-4.ec2.cloud.redislabs.com:17932'
})

const pubsub = new RedisPubSub({
  client
})
// Eventualmente se usara graphql-redis-subscriptions
// Ya es es mas escalable
// pubsub.ee.setMaxListeners(30)

export default pubsub
