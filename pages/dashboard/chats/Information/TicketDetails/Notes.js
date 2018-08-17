import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withApollo, Query } from 'react-apollo'
import NoteInput from './NoteInput'
import Note from './Note'
import { DELETE_TICKET_NOTE, UPDATE_TICKET_NOTE, CREATE_TICKET_NOTE, TICKET_NOTES } from '../../chat-queries'

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
    const res = await this.props.client.mutate({
      mutation: CREATE_TICKET_NOTE,
      variables: {
        ticket,
        text
      }
    })

    // Actualizamos cache de Apollo
    const { ticketNotes } = this.props.client.cache.readQuery({
      query: TICKET_NOTES,
      variables: { ticket }
    })

    this.props.client.cache.writeQuery({
      query: TICKET_NOTES,
      variables: { ticket },
      data: { ticketNotes: [ res.data.ticketNoteCreate, ...ticketNotes ] }
    })

    // Forzamos el renderizado
    this.forceUpdate()
  }

  // Modificar nota del ticket
  updateTicketNote = async ({ _id, text, ticket }) => {
    const res = await this.props.client.mutate({
      mutation: UPDATE_TICKET_NOTE,
      variables: { _id, text, ticket }
    })

    // Actualizamos cache de Apollo
    const { ticketNotes } = this.props.client.cache.readQuery({
      query: TICKET_NOTES,
      variables: { ticket }
    })

    this.props.client.cache.writeQuery({
      query: TICKET_NOTES,
      variables: { ticket },
      data: { ticketNotes: ticketNotes.map(note => {
        if (note._id === res.data.ticketNoteUpdate._id) {
          return res.data.ticketNoteUpdate
        }
        return note
      })}
    })
  }

  // Eliminar nota del ticket
  deleteTicketNote = async (_id) => {
    await this.props.client.mutate({
      mutation: DELETE_TICKET_NOTE,
      variables: { _id }
    })

    const { ticket } = this.props

    // Actualizamos cache de Apollo
    const { ticketNotes } = this.props.client.cache.readQuery({
      query: TICKET_NOTES,
      variables: { ticket }
    })

    this.props.client.cache.writeQuery({
      query: TICKET_NOTES,
      variables: { ticket },
      data: {
        ticketNotes: ticketNotes.filter(note => note._id !== _id)
      }
    })

    // Forzamos el renderizado
    this.forceUpdate()
  }

  render () {
    return (
      <Query query={TICKET_NOTES} variables={{ ticket: this.props.ticket }} >
        {({ data, loading }) => {
          if (data && !loading) {
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
          } else return null
        }}
      </Query>
    )
  }
}

export default withApollo(NotesComponent)
