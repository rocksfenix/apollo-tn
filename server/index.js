import 'dotenv/config'
import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import mongoose from 'mongoose'
import compression from 'compression'
import bodyParser from 'body-parser'
import next from 'next'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { makeExecutableSchema } from 'graphql-tools'
import formatError from './formatError'
// import session from 'express-session'
import security from './middlewares/security'
import auth from './middlewares/auth'

const PORT = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
  const app = next({
    dev
  })

  const handle = app.getRequestHandler()

  app.prepare()
    .then(() => {
      const server = express()

      server.use(compression())

      server.use(cookieParser())

      // Security middlewares.
      server.use(...security)

      server.use(bodyParser.urlencoded({ extended: false }))

      server.use(auth.checkHeaders)

      server.use('/graphql', bodyParser.json(),
        graphqlExpress(req => ({
          formatError,
          schema,
          context: {
            req,
            headers: req.headers,
            user: req.user
          }
        })))

      server.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

      // PAGES
      server.get('/', (req, res) => {
        app.render(req, res, '/home', req.query)
      })

      server.get('/invoice/:id/:slug', (req, res) => {
        return app.render(req, res, '/invoice')
      })

      // END PAGES

      server.get('*', (req, res) => handle(req, res))

      server.listen(PORT, () => {
        console.log(`
          MongoDB OK
          corriendo en MODO: ${process.env.NODE_ENV}
          corriendo en SAFE_ENV: ${process.env.SAFE_ENV}
          Server is Running at PORT: ${PORT}
      `)
      })
    })
    .catch(error => {
      console.log(error)
    })
})
  .catch(error => {
    console.log(error)
    throw Error(error)
  })
