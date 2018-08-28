import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import TicketText from './TicketText'
import Notes from './Notes'
import TicketStatus from './TicketStatus'
import { TICKET_UPDATE, DELETE_TICKET, CREATE_TICKET_NOTE } from '../Chats/chat-queries'
import Priority from './Priority'
import Status from './Status'
import moment from 'moment'

const Ticket = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${p => p.isColapsed ? '50px' : '330px'};
  background-color: #FFF;
  border-bottom: ${p => p.isColapsed ? '2px solid #f3f3f3' : '2px solid #909090'};
  will-change: height, background, border;
  transition: height 150ms cubic-bezier(1,0,0,1), background 700ms ease-out, border 300ms ease-out;
  overflow: hidden;
  position: relative;
  background-color: ${p => p.isColapsed ? '#FFF' : '#f5fcff;'};
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
  align-items: center;
  justify-content: ${p => p.align || 'center'};
  width: ${p => p.width};
  font-size: 15px;
`

const TextTicket = styled.div`
  width: 40%;
  height: 100%;
`

const NotesTicket = styled.div`
  width: 50%;
  height: 100%;
`

const Date = styled.div`
  font-size: 12px;
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
    await this.props.client.mutate({
      mutation: TICKET_UPDATE,
      variables: {
        _id: this.props.ticket._id,
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
  }

    // Crea una nota cada vez que cambia de estatus
    createNote = async (status) => {
      const ticket = this.props.ticket._id
      await this.props.client.mutate({
        mutation: CREATE_TICKET_NOTE,
        variables: {
          ticket,
          text: `Se cambia status a ${status}.`
        }
      })
    }

    render () {
      const { ticket } = this.props
      return (
        <Ticket isColapsed={this.state.isColapsed} onClick={this.toggle}>
          <Header>
            <Column width='10%'>
              <Priority priority={ticket.priority} />
            </Column>
            <Column width='20%' align='left'>{ticket.text.substring(0, 35)}</Column>
            <Column width='10%'>
              <Status status={ticket.status} />
            </Column>
            <Column width='10%'>
              <Date>
                {moment(ticket.createdAt).format('MMMM D YYYY, h:mm:ss a')} <br />
                ( {moment(ticket.createdAt).fromNow()} )
              </Date>
            </Column>
            <Column width='10%'>{ticket.category}</Column>
            <Column width='10%'>{ticket.like ? 'SI' : 'NO'}</Column>
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
