import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withApollo, Query } from 'react-apollo'
import NoteInput from './NoteInput'
import Note from './Note'
import { DELETE_TICKET_NOTE, UPDATE_TICKET_NOTE, CREATE_TICKET_NOTE, TICKET_NOTES, ON_TICKET_NOTE_CREATE, ON_TICKET_NOTE_UPDATE, ON_TICKET_NOTE_DELETE } from '../Chats/chat-queries'

const Notes = styled.div`
  background-color: #FFF;
  height: 157px;
  overflow-y: auto;
`

class NotesComponent extends Component {
  static propTypes = {
    // Representa el ID del ticket en foco
    ticket: PropTypes.string
  }

  // Agregar Nota al ticket
  newTicketNote = async (text) => {
    const { ticket } = this.props
    await this.props.client.mutate({
      mutation: CREATE_TICKET_NOTE,
      variables: {
        ticket,
        text
      }
    })
  }

  // Modificar nota del ticket
  updateTicketNote = async ({ _id, text, ticket }) => {
    await this.props.client.mutate({
      mutation: UPDATE_TICKET_NOTE,
      variables: { _id, text, ticket }
    })
  }

  // Eliminar nota del ticket
  deleteTicketNote = async (_id) => {
    await this.props.client.mutate({
      mutation: DELETE_TICKET_NOTE,
      variables: { _id }
    })
  }

  componentWillUnmount () {
    if (this.subsCreate) this.subsCreate()
    if (this.subsUpdate) this.subsUpdate()
    if (this.subsDelete) this.subsDelete()
  }

  subsCreate = null
  subsUpdate = null
  subsDelete = null

  render () {
    return (
      <Query query={TICKET_NOTES} variables={{ ticket: this.props.ticket }} >
        {({ data, loading, error, subscribeToMore }) => {
          if (error) return <h1>Error {error}</h1>
          if (loading) return <h1>...loading</h1>

          if (!this.subsCreate && process.browser) {
            this.subsCreate = subscribeToMore({
              document: ON_TICKET_NOTE_CREATE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev

                // La subscripcion se dispara para cada ticket
                // De esta forma validamos que solo agrege la nota al ticket
                // correspondiente
                if (subscriptionData.data.onTicketNoteCreate.ticket !== this.props.ticket) return prev

                // Se agrega solo si no existe, evitar duplicidad
                if (prev.ticketNotes.filter(n => n._id === subscriptionData.data.onTicketNoteCreate._id)[0]) {
                  return prev
                }

                return {
                  ...prev,
                  ticketNotes: [
                    subscriptionData.data.onTicketNoteCreate,
                    ...prev.ticketNotes
                  ]
                }
              }
            })
          }

          if (!this.subsUpdate && process.browser) {
            this.subsUpdate = subscribeToMore({
              document: ON_TICKET_NOTE_UPDATE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const { onTicketNoteUpdate } = subscriptionData.data

                // Solo al ticket correspondiente
                if (onTicketNoteUpdate.ticket !== this.props.ticket) return prev

                return {
                  ...prev,
                  ticketNotes: prev.ticketNotes.map(n => n._id === onTicketNoteUpdate._id ? onTicketNoteUpdate : n)
                }
              }
            })
          }

          if (!this.subsDelete && process.browser) {
            this.subsDelete = subscribeToMore({
              document: ON_TICKET_NOTE_DELETE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const { onTicketNoteDelete } = subscriptionData.data

                // Solo al ticket correspondiente
                if (onTicketNoteDelete.ticket !== this.props.ticket) return prev

                return {
                  ...prev,
                  ticketNotes: prev.ticketNotes.filter(n => n._id !== onTicketNoteDelete._id)
                }
              }
            })
          }

          return (
            <div>
              <NoteInput onEnter={this.newTicketNote} />
              <Notes>
                {data.ticketNotes.map(note => (
                  <Note
                    key={note._id}
                    note={note}
                    onConfirm={this.updateTicketNote}
                    onDelete={this.deleteTicketNote}
                  />
                ))}
              </Notes>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default withApollo(NotesComponent)
