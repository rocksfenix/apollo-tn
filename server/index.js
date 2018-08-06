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
import getInstrospection from './getInstrospection'
import models from './models'

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

      server.get('/instrospection', getInstrospection)

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

      // HOME PUBLIC
      server.get('/', (req, res) => {
        console.log(req.params)
        app.render(req, res, '/home', {
          query: req.query,
          params: req.params
        })
      })

      // HOME LOGGED  '/app:tab?/course?/:lesson?'
      server.get('/app/:tab/:course?/:lesson?', (req, res) => {
        console.log(req.params)
        app.render(req, res, '/app', {
          query: req.query,
          params: req.params
        })
      })

      // Dashboard admin
      server.get('/dashboard/:tab/:course?/:lesson?', (req, res) => {
        console.log(req.params)
        app.render(req, res, '/app', {
          query: req.query,
          params: req.params
        })
      })

      server.get('/statistics', async (re, res) => {
        const User = models.User
        let todayStart = new Date()
        let todayEnd = new Date()
        todayStart.setHours(0, 0, 0, 0)
        todayEnd.setHours(23, 59, 59, 999)

        // Ultimos 30 dias
        let _30 = new Date()
        _30.setDate(_30.getDate() - 30)

        const today = {
          pro: await User.count({role: 'pro', createdAt: {'$gte': todayStart}}),
          free: await User.count({role: 'free', createdAt: {'$gte': todayStart}}),
          admin: await User.count({role: 'admin', createdAt: {'$gte': todayStart}})
        }

        const total = {
          pro: await User.count({ role: 'pro' }),
          free: await User.count({ role: 'free' }),
          admin: await User.count({ role: 'admin' })
        }

        const pipline = [
          {
            $project: {
              role: '$role',
              createdAt: 1,
              fechaRegistro: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            }
          },
          {
            $group: {
              _id: '$fechaRegistro',
              free: {
                '$sum': {
                  '$cond': [
                    { '$eq': [ '$role', 'free' ] },
                    1, 0
                  ]
                }
              },
              pro: {
                '$sum': {
                  '$cond': [
                    { '$eq': [ '$role', 'pro' ] },
                    1, 0
                  ]
                }
              },
              admin: {
                '$sum': {
                  '$cond': [
                    { '$eq': [ '$role', 'admin' ] },
                    1, 0
                  ]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              free: 1,
              pro: 1,
              admin: 1
            }
          },
          {
            $sort: {
              '_id': 1
            }
          }
        ]

        User.aggregate(pipline)
          .exec()
          .then(last30Days => {
            res.json({
              statistics: {
                today,
                total,
                last30Days,
                todayStart,
                todayEnd
              }
            })
          })
          .catch(next)
      })

      server.get('/invoice/:id/:slug', (req, res) => {
        return app.render(req, res, '/invoice')
      })

      // END PAGES

      server.get('*', (req, res) => handle(req, res))

      server.listen(PORT, () => {
        console.log(`
          MongoDB OK 🚀
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
