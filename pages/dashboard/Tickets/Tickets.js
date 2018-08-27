import React, {Component} from 'react'
import styled from 'styled-components'
import _Panel from '../Panel'
import { Query } from 'react-apollo'
import Header from './Header'
import Table from './Table'
import { TICKETS } from '../Chats/chat-queries'

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
    console.log('FORCE')
    this.forceUpdate()
  }

  render () {
    return (
      <Panel show={this.props.show} >
        <Header onFilter={this.onFilter} filter={this.state.filter} />
        <Query
          query={TICKETS}
          variables={{ status: this.state.filter, first: this.state.itemsByPage, skip: this.state.skip }}
          fetchPolicy='network-only'
        >
          {({ data, loading, error }) => {
            if (error) return <h1>Error {error}</h1>

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
