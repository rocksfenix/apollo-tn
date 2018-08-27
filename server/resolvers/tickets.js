import models from '../models'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'

export default {
  Query: {
    // Regresa los tickets pueden ser filtrados por
    // un lciente especifico, o pasar first skip para paginacion
    allTickets: async (_, { first, skip, customer, status, priority }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const query = {}

      if (customer) query.customer = customer
      if (status && status !== 'all') query.status = status
      if (priority && priority !== 'all') query.priority = priority

      let limit = first <= 100 ? first : 100

      const tickets = await models.Ticket
        .find(query)
        .populate('author customer')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

      let total = 0

      // Si no hay query adicional, el total es la cantidad en Coleccion
      if (customer || status || priority) {
        total = await models.Ticket.find(query).count()
      } else {
        total = await models.Ticket.estimatedDocumentCount()
      }

      console.log('**** TOTAL ', total)
      return {
        tickets,
        total
      }
    }
  },

  Mutation: {
    // Posiblemente se requiera de liberar de forma
    // publica pero protegido con recaptcha
    ticketCreate: async (_, { input }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      // if (user.role !== 'admin') throw new ForbiddenError()

      const ticket = await models.Ticket.create({
        ...input,
        author: user.sub
      })

      const ticketPopulated = await models.Ticket.populate(ticket,
        { path: 'author customer', model: 'User' }
      )

      return ticketPopulated
    },

    ticketUpdate: async (_, { input }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const ticket = await models.Ticket.findById(input).populate('author customer')

      if (!ticket) throw new NotFound()

      Object.keys(input).forEach(key => {
        ticket[key] = input[key]
      })

      await ticket.save()

      return ticket
    },

    ticketDelete: async (_, { _id }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const ticket = await models.Ticket.findById(_id).populate('author customer')
      if (!ticket) throw new NotFound()
      await ticket.remove()
      return ticket
    },

    // Al finalizar la session de chat, el feedback que genera el usuario
    ticketFeedback: async (_, { ticket, agent, like }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()

      const _ticket = await models.Ticket.findById(ticket)

      _ticket.like = like
      _ticket.conversationAgent = agent
      _ticket.userFeedback = true

      await _ticket.save()

      return _ticket
    }
  }
}
