import React, {Component} from 'react'
import styled from 'styled-components'
import { Query, withApollo } from 'react-apollo'
import Textarea from '../Textarea'
import Multioption from '../Multioption'
import TicketDetails from './TicketDetails'
import { TICKETS, NEW_TICKET, ON_TICKET_CREATE, ON_TICKET_UPDATE, ON_TICKET_DELETE } from './chat-queries'

const Panel = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
`

const Tickets = styled.div`
  width: 100%;
  height: 300px;
  border-top: 1px solid gray;
  padding: .3em .6em;
  overflow-y: auto;
  overflow-x: hidden;
`

const TicketBox = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: .5em 0;
  border-bottom: 1px solid #e5e5e5;

  :hover {
    background: #e7e7e7;
  }
`

const TicketStatus = styled.span`
  background-color: ${p => {
    if (p.status === 'new') return '#df1b1b'
    if (p.status === 'working') return '#00b6ff'
    if (p.status === 'completed') return '#1bdf60'
  }};
  color: #FFF;
  font-size: 12px;
  padding: .2em .9em;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Priority = styled.span`
  background: ${props => {
    if (props.priority === 'low') { return 'gray' }
    if (props.priority === 'normal') { return '#00adff' }
    if (props.priority === 'urgent') { return 'red' }
  }};
  border-radius: 25px;
  color: #FFF;
  font-size: 12px;
  padding: .2em .5em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
`

const TicketText = styled.span`
  font-size: 12px;
`

const Ticket = ({ ticket, onClick }) => (
  <TicketBox onClick={onClick}>
    <TicketStatus status={ticket.status}>{ ticket.status }</TicketStatus>
    <TicketText>{ ticket.text }</TicketText>
    <Priority priority={ticket.priority}>{ ticket.priority }</Priority>
    { ticket.userFeedback
      ? ticket.like ? 'Y' : 'N'
      : null
    }
  </TicketBox>
)

const Title = styled.div`
  width: 100%;
  font-family: 'Open Sans',sans-serif;
  letter-spacing: -.003em;
  line-height: 1.58;
  font-size: 16px;
  color: #4b4c65;
  padding: .2em 0 .2em 1em;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg, #d8bcf7, #cfd5ff);
  background: linear-gradient(90deg,#4f22da,#9effe9);
  background: linear-gradient(90deg,rgb(35, 67, 89),rgb(0, 0, 0));
  color: #FFF;
`

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

const ButtonNewTicket = styled.div`
  background: #FFF;
  padding: .2em 1em;
  border-radius: 2px;
  font-size: 14px;
  color: #222;
  margin: 0 .5em;
  opacity: .8;
  transition: all .2s ease-out;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`

const NewTicket = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFF;
  top: 0;
  position: absolute;
  right: ${p => p.show ? '0%' : '-100%'};
  transition: all .2s ease-out;
  border-top: 1px solid #e1dede;
  border-bottom: 1px solid #e1dede;
  padding: .3em 1.1em;
  z-index: 2;
`

class TicketsComponent extends Component {
  state = {
    show: '',
    ticketInFocus: { notes: [] },
    newTicket: { text: '', priority: 'normal' }
  }

  newNoteTicketNote = (e) => {
    console.log(e)
  }

  showDetails = (ticket) => this.setState({ show: 'details', ticketInFocus: ticket })

  showNew = (e) => this.setState({ show: 'new' })

  hidde = () => this.setState({ show: '' })

  setTicketInFocus = (key, val) => this.setState(state => ({
    ...state,
    ticketInFocus: {
      ...state.ticketInFocus,
      [key]: val
    }
  }))

  onChangeNewTicket = (key, value) => this.setState(state => ({
    ...state,
    newTicket: {
      ...state.newTicket,
      [key]: value
    }
  }))

  createNewTicket = async () => {
    const { text, priority } = this.state.newTicket
    const ticket = {
      text,
      priority,
      customer: this.props.customer._id
    }

    await this.props.client.mutate({
      mutation: NEW_TICKET,
      variables: ticket
    })

    this.setState({
      show: '',
      newTicket: {
        text: '',
        priority: 'normal'
      }
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

  force = () => {
    this.forceUpdate()
  }

  render () {
    return (
      <Query query={TICKETS} variables={{ customer: this.props.customer._id }}>
        {({ data, loading, error, subscribeToMore }) => {
          if (loading) return <h1>... Loading</h1>
          if (error) return <h1>... Error</h1>

          if (!this.subsCreate && process.browser) {
            this.subsCreate = subscribeToMore({
              document: ON_TICKET_CREATE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                // Informar nuevo ticket
                window.setTimeout(() => this.force(), 100)
                return {
                  ...prev,
                  allTickets: {
                    ...prev.allTickets,
                    total: prev.allTickets.total + 1,
                    tickets: [subscriptionData.data.onTicketCreate, ...prev.allTickets.tickets]
                  }
                }
              }
            })
          }

          if (!this.subsUpdate && process.browser) {
            this.subsUpdate = subscribeToMore({
              document: ON_TICKET_UPDATE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                window.setTimeout(() => this.force(), 300)
                const { onTicketUpdate } = subscriptionData.data

                return {
                  ...prev,
                  allTickets: {
                    ...prev.allTickets,
                    tickets: prev.allTickets.tickets.map(t => t._id === onTicketUpdate._id ? onTicketUpdate : t)
                  }
                }
              }
            })
          }

          if (!this.subsDelete && process.browser) {
            this.subsDelete = subscribeToMore({
              document: ON_TICKET_DELETE,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                window.setTimeout(() => this.force(), 100)
                const { onTicketDelete } = subscriptionData.data

                return {
                  ...prev,
                  allTickets: {
                    ...prev.allTickets,
                    total: prev.allTickets.total - 1,
                    tickets: prev.allTickets.tickets.filter(t => t._id !== onTicketDelete._id)
                  }
                }
              }
            })
          }

          return (
            <Panel>
              <NewTicket show={this.state.show === 'new'} >
                <Header>
                  <Back onClick={this.hidde}>
                    <i className='icon-arrow-left' />
                  </Back>
                  <Buttons>
                    <Button active onClick={this.createNewTicket}>Create</Button>
                  </Buttons>
                </Header>
                <Textarea
                  size='15px'
                  onChange={this.onChangeNewTicket}
                  value={this.state.newTicket.text}
                  keyName='text'
                />
                <Multioption
                  label='priority'
                  keyName='priority'
                  size='15px'
                  active={this.state.newTicket.priority}
                  options={[
                    { value: 'low' },
                    { value: 'normal' },
                    { value: 'urgent' }
                  ]}
                  onChange={this.onChangeNewTicket}
                />
              </NewTicket>

              <TicketDetails
                ticketInFocus={data.allTickets.tickets.filter(t => t._id === this.state.ticketInFocus._id)[0]}
                customerId={this.props.customer._id}
                show={this.state.show === 'details'}
                onHidden={this.hidde}
              />

              <Title>Tickets <ButtonNewTicket onClick={this.showNew}>Create New</ButtonNewTicket></Title>
              <Tickets>
                {data.allTickets.tickets.map(ticket => (
                  <Ticket
                    key={ticket._id}
                    onClick={() => this.showDetails(ticket)}
                    ticket={ticket}
                  />
                ))}
              </Tickets>
            </Panel>
          )
        }}
      </Query>
    )
  }
}

export default withApollo(TicketsComponent)
