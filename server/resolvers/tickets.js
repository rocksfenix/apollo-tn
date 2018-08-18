import models from '../models'
import { AuthenticationRequiredError, ForbiddenError, NotFound } from '../authorization/errors'

export default {
  Query: {
    // Regresa los tickets pueden ser filtrados por
    // un lciente especifico, o pasar first skip para paginacion
    tickets: async (_, { first, skip, customer }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const query = customer ? { customer } : {}

      return models.Ticket
        .find(query)
        .populate('author customer')
        .limit(first)
        .skip(skip)
        .sort({ createdAt: -1 })
    }
  },

  Mutation: {
    // Posiblemente se requiera de liberar de forma
    // publica pero protegido con recaptcha
    ticketCreate: async (_, { input }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

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
    }
  }
}
