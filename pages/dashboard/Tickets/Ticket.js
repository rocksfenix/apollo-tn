import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import TicketText from './TicketText'
import Notes from './Notes'
import TicketStatus from './TicketStatus'
import { TICKET_UPDATE, DELETE_TICKET, CREATE_TICKET_NOTE, TICKET_NOTES, TICKETS } from '../Chats/chat-queries'

const Ticket = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${p => p.isColapsed ? '50px' : '330px'};
  background-color: #FFF;
  border-bottom: ${p => p.isColapsed ? '1px solid #f3f3f3' : '2px solid #90afd6'};
  will-change: height, background;
  transition: height 150ms cubic-bezier(1,0,0,1), background 700ms ease-out;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.isColapsed ? '#FFF' : '#90afd6'};


  &:hover {
    /* background-color: #fbfbfb; */
  }
`
const Header = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  user-select: none;
  cursor: pointer;
`

const Details = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50px;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1em;
  transition: all 400ms ease-out;
  will-change: transform, opacity;
  opacity: ${p => p.isColapsed ? '0' : '1'};
  transform: ${p => p.isColapsed ? 'scale(.90)' : 'scale(1)'};
`

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TextTicket = styled.div`
  width: 40%;
  height: 100%;
`

const NotesTicket = styled.div`
  width: 50%;
  height: 100%;
`

class TicketComponent extends Component {
  state = { isColapsed: true }

  expand = () => this.setState({ isColapsed: false })

  colapse = () => this.setState({ isColapsed: true })

  toggle = (e) => this.setState(state => ({
    ...state,
    isColapsed: !state.isColapsed
  }))

  // Previene la propagacion del click
  prev = (e) => {
    e.stopPropagation()
  }

  // Actualiza el status del ticket
  onUpdateStatus = async (status) => {
    const res = await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: {
        _id: this.props.ticket._id,
        status
      }
    })

    const { first, skip } = this.props

    // Actualizamos cache de Apollo
    const { allTickets } = this.props.client.cache.readQuery({
      query: TICKETS,
      variables: { status: this.props.ticket.status, first, skip }
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: { status: this.props.ticket.status, first, skip },
      data: {
        allTickets: {
          ...allTickets,
          tickets: allTickets.tickets.map(t => t._id === res.data.ticketUpdate._id ? res.data.ticketUpdate : t)
        }
      }
    })

    this.createNote(status)
  }

  // Actualiza el texto del ticket
  updateText = async (ticket) => {
    const res = await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: ticket
    })

    // Actualizamos cache de Apollo
    const { allTickets } = this.props.client.cache.readQuery({
      query: TICKETS
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      data: {
        allTickets: {
          tickets: allTickets.tickets.map(t => t._id === res.data.ticketUpdate._id ? res.data.ticketUpdate : t)
        }
      }
    })
  }

  // Eliminat ticket
  deleteTicket = async (_id) => {
    await this.props.client.mutate({
      mutation: DELETE_TICKET,
      variables: { _id }
    })

    // Actualizamos cache de Apollo
    const { tickets } = this.props.client.cache.readQuery({
      query: TICKETS,
      variables: {}
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: {},
      data: { tickets: tickets.filter(t => t._id !== _id) }
    })

    this.props.onHidden()
  }

    // Crea una nota cada vez que cambia de estatus
    createNote = async (status) => {
      const ticket = this.props.ticket._id
      const res = await this.props.client.mutate({
        mutation: CREATE_TICKET_NOTE,
        variables: {
          ticket,
          text: `Se cambia status a ${status}.`
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

    render () {
      const { ticket } = this.props
      return (
        <Ticket isColapsed={this.state.isColapsed} onClick={this.toggle}>
          <Header>
            <Column>{ticket.priority}</Column>
            <Column>{ticket.text.substring(0, 30)}</Column>
            <Column>{ticket.status}</Column>
            <Column>{ticket.createdAt}</Column>
            <Column>{ticket.category}</Column>
            <Column>{ticket.like ? 'SI' : 'NO'}</Column>
          </Header>
          <Details isColapsed={this.state.isColapsed} onClick={this.prev}>
            <TextTicket>
              <TicketStatus
                status={ticket.status}
                onUpdateStatus={this.onUpdateStatus}
                fontSize='18px'
              />
              <TicketText
                ticket={ticket}
                onConfirm={this.updateText}
                onDelete={this.deleteTicket}
              />
            </TextTicket>
            <NotesTicket>
              <Notes ticket={ticket._id} />
            </NotesTicket>
          </Details>
        </Ticket>
      )
    }
}

export default withApollo(TicketComponent)
