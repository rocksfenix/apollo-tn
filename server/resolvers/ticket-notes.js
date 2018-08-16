import models from '../models'
import { NotFound, AuthenticationRequiredError, ForbiddenError } from '../errors'

export default {
  Query: {
    // Regresa los tickets pueden ser filtrados por
    // un lciente especifico, o pasar first skip para paginacion
    ticketNotes: async (_, { first, skip, ticket }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const query = ticket ? { ticket } : {}

      return models.TicketNote
        .find(query)
        .populate('author')
        .limit(first)
        .skip(skip)
        .sort({ createdAt: -1 })
    }
  },

  Mutation: {
    ticketNoteCreate: async (_, { text, ticket }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()

      const ticketNote = await models.TicketNote.create({
        text,
        ticket,
        author: user.sub
      })

      const ticketNotePopulated = await models.TicketNote.populate(ticketNote,
        { path: 'author', model: 'User' }
      )

      return ticketNotePopulated
    },

    ticketNoteUpdate: async (_, { _id, text, ticket }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const ticketNote = await models.TicketNote.findById(_id).populate('author')

      if (!ticketNote) throw new NotFound()

      ticketNote.text = text

      await ticketNote.save()

      return ticketNote
    },

    ticketNoteDelete: async (_, { _id }, { user }) => {
      if (!user.sub) throw new AuthenticationRequiredError()
      if (user.role !== 'admin') throw new ForbiddenError()

      const ticketNote = await models.TicketNote.findById(_id).populate('author')
      if (!ticketNote) throw new NotFound()
      await ticketNote.remove()
      return ticketNote
    }
  }
}
