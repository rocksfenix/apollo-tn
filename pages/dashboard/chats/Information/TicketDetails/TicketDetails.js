import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import TicketText from './TicketText'
import Notes from './Notes'
import { TICKET_UPDATE, DELETE_TICKET, CREATE_TICKET_NOTE } from '../../chat-queries'

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
  background: ${p => p.active ? 'linear-gradient(90deg,rgb(28, 36, 41),rgb(0, 0, 0))' : '#e5eaf0'};
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
    await this.props.client.mutate({
      mutation: CREATE_TICKET_NOTE,
      variables: {
        ticket,
        text: `Se cambia status a ${status}.`
      }
    })
  }

  // Actualiza el status del ticket
  updateStatus = async (status) => {
    await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: {
        _id: this.props.ticketInFocus._id,
        status
      }
    })

    this.createNote(status)
  }

  // Actualiza el texto del ticket
  updateText = async (ticket) => {
    await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: ticket
    })
  }

  // Eliminat ticket
  deleteTicket = async (_id) => {
    await this.props.client.mutate({
      mutation: DELETE_TICKET,
      variables: { _id }
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
