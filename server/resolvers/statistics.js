import models from '../models'

export default {
  Query: {
    statistics: async (_, args) => {
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

      const last30Days = await User.aggregate(pipline)

      return {
        today,
        total,
        last30Days
      }
    }
  }
}
