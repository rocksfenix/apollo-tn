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
    filter: 'new'
  }

  onFilter = (filter) => {
    console.log(filter)
    this.setState({ filter })
  }

  render () {
    return (
      <Panel show={this.props.show} >
        <Header onFilter={this.onFilter} filter={this.state.filter} />
        <Query query={TICKETS}>
          {({ data, loading, error }) => {
            if (loading) return <h1>Loadig</h1>
            if (error) return <h1>Error {error}</h1>

            return (
              <Table tickets={data.tickets} />
            )

          }}
        </Query>
      </Panel>
    )
  }
}

export default Tickets
