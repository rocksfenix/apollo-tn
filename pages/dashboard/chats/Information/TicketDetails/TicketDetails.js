import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import TicketText from './TicketText'
import Notes from './Notes'
import { TICKET_UPDATE, DELETE_TICKET, CREATE_TICKET_NOTE, TICKET_NOTES, TICKETS } from '../../chat-queries'

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const Back = styled.button`
  border: 0;
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.div`
  background: ${p => p.active ? '#4a5ec3' : '#e5eaf0'};
  color: ${p => p.active ? '#FFF' : '#222'};
  padding: .2em 1em;
  border-radius: 2px;
  font-size: 14px;
  margin: 0 .5em;
  opacity: .8;
  transition: all .2s ease-out;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`

const TicketDetails = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFF;
  top: 0;
  position: absolute;
  right: ${p => p.show ? '0%' : '-100%'};
  transition: all .1s ease-out;
  border-top: 1px solid #e1dede;
  border-bottom: 1px solid #e1dede;
  padding: .3em 0;
  z-index: 2;
`

class TicketDetailsComponent extends Component {
  // Crea una nota cada vez que cambia de estatus
  createNote = async (status) => {
    const ticket = this.props.ticketInFocus._id
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

  // Actualiza el status del ticket
  updateStatus = async (status) => {
    const res = await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: {
        _id: this.props.ticketInFocus._id,
        status
      }
    })

    // Actualizamos cache de Apollo
    const { tickets } = this.props.client.cache.readQuery({
      query: TICKETS,
      variables: { customer: this.props.customerId }
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: { customer: this.props.customerId },
      data: { tickets: tickets.map(t => t._id === res.data.ticketUpdate._id ? res.data.ticketUpdate : t) }
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
    const { tickets } = this.props.client.cache.readQuery({
      query: TICKETS,
      variables: { customer: this.props.customerId }
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: { customer: this.props.customerId },
      data: { tickets: tickets.map(t => t._id === res.data.ticketUpdate._id ? res.data.ticketUpdate : t) }
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
      variables: { customer: this.props.customerId }
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: { customer: this.props.customerId },
      data: { tickets: tickets.filter(t => t._id !== _id) }
    })

    this.props.onHidden()
  }

  render () {
    const { ticketInFocus } = this.props
    if (!ticketInFocus) return null
    return (
      <TicketDetails show={this.props.show}>
        <Header>
          <Back onClick={this.props.onHidden}>
            <i className='icon-arrow-left' />
          </Back>
          <Buttons>
            <Button active={ticketInFocus.status === 'new'} onClick={() => this.updateStatus('new')}>New</Button>
            <Button active={ticketInFocus.status === 'working'} onClick={() => this.updateStatus('working')}>Working</Button>
            <Button active={ticketInFocus.status === 'completed'} onClick={() => this.updateStatus('completed')}>Completed</Button>
          </Buttons>
        </Header>
        <TicketText
          ticket={ticketInFocus}
          onConfirm={this.updateText}
          onDelete={this.deleteTicket}
        />
        <Notes
          ticket={ticketInFocus._id}
        />
      </TicketDetails>
    )
  }
}

export default withApollo(TicketDetailsComponent)
