import React, {Component} from 'react'
import styled from 'styled-components'
import _Panel from '../Panel'
import { Query } from 'react-apollo'
import Header from './Header'
import Table from './Table'
import { TICKETS, ON_TICKET_CREATE, ON_TICKET_UPDATE, ON_TICKET_DELETE } from '../Chats/chat-queries'

const Panel = styled(_Panel)`
  display: flex;
  flex-direction: column;
`

class Tickets extends Component {
  state = {
    filter: 'new',
    itemsByPage: 20,
    skip: 0
  }

  onFilter = (filter) => {
    console.log(filter)
    this.setState({ filter, skip: 0 })
  }

  onNextPage = (currentPage) => {
    this.setState(state => ({ ...state, skip: state.itemsByPage * currentPage }))
  }

  onPrevPage = (currentPage) => {
    this.setState(state => ({ ...state, skip: state.itemsByPage * currentPage }))
  }

  force = () => {
    this.forceUpdate()
  }

  subsCreate = null
  subUpdate = null
  subsDelete = null

  render () {
    return (
      <Panel show={this.props.show} >
        <Header onFilter={this.onFilter} filter={this.state.filter} />
        <Query
          query={TICKETS}
          variables={{ status: this.state.filter, first: this.state.itemsByPage, skip: this.state.skip }}
          fetchPolicy='network-only'
        >
          {({ data, loading, error, subscribeToMore }) => {
            if (error) return <h1>Error {error}</h1>

            if (!this.subsCreate && process.browser) {
              this.subsCreate = subscribeToMore({
                document: ON_TICKET_CREATE,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev
                  // Informar nuevo ticket
                  window.setTimeout(() => this.force(), 100)
                  this.props.onNewTicket()
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
              <Table
                allTickets={data.allTickets}
                loading={loading}
                onNextPage={this.onNextPage}
                onPrevPage={this.onPrevPage}
                itemsByPage={this.state.itemsByPage}
                first={this.state.itemsByPage}
                skip={this.state.skip}
                force={this.force}
              />
            )
          }}
        </Query>
      </Panel>
    )
  }
}

export default Tickets
