import React, {Component} from 'react'
import styled from 'styled-components'
import { Query, withApollo } from 'react-apollo'
import Textarea from '../../../components/Textarea'
import Multioption from '../../../components/Multioption'
import TicketDetails from './TicketDetails'
import { TICKETS, NEW_TICKET } from './chat-queries'

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
  padding: .2em .5em;
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
  font-size: 15px;
`

const Ticket = ({ ticket, onClick }) => (
  <TicketBox onClick={onClick}>
    <TicketStatus status={ticket.status}>{ ticket.status }</TicketStatus>
    <TicketText>{ ticket.text }</TicketText>
    <Priority priority={ticket.priority}>{ ticket.priority }</Priority>
  </TicketBox>
)

const Title = styled.div`
  width: 100%;
  font-family: 'Open Sans',sans-serif;
  letter-spacing: -.003em;
  line-height: 1.58;
  font-size: 20px;
  font-weight: bold;
  color: #4b4c65;
  background: linear-gradient(90deg, #d8bcf7, #cfd5ff);
  padding: .2em 0 .2em 1em;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg,#4f22da,#9effe9);
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
    // tickets: [],
    notes: [],
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

    const res = await this.props.client.mutate({
      mutation: NEW_TICKET,
      variables: ticket
    })

    // Actualizamos cache de Apollo
    // Listamos los tickets desde el cache
    const { tickets } = this.props.client.cache.readQuery({
      query: TICKETS,
      variables: { customer: this.props.customer._id }
    })

    this.props.client.cache.writeQuery({
      query: TICKETS,
      variables: { customer: this.props.customer._id },
      data: { tickets: [ res.data.ticketCreate, ...tickets ] }
    })

    this.setState({
      show: '',
      newTicket: {
        text: '',
        priority: 'normal'
      }
    })
  }

  render () {
    console.log('RENDER', this.state)
    return (
      <Query query={TICKETS} variables={{ customer: this.props.customer._id }}>
        {({ data, loading }) => {
          if (data && !loading) {
            if (data) {
              console.log(data)
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
                  ticketInFocus={data.tickets.filter(t => t._id === this.state.ticketInFocus._id)[0]}
                  customerId={this.props.customer._id}
                  show={this.state.show === 'details'}
                  onHidden={this.hidde}
                />

                <Title>Tickets <Button onClick={this.showNew}>Create New</Button></Title>
                <Tickets>
                  {data.tickets.map(ticket => (
                    <Ticket onClick={() => this.showDetails(ticket)} ticket={ticket} />
                  ))}
                </Tickets>
              </Panel>
            )
          } else return null
        }}
      </Query>
    )
  }
}

export default withApollo(TicketsComponent)
