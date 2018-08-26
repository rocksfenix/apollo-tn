import React, {Component} from 'react'
import styled from 'styled-components'
import Panel from '../Panel'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Header from './Header'
import Ticket from './Ticket'

const Table = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Tickets = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #FFF;
  overflow-y: auto;
`

const Buttons = styled.div`
  width: 100%;
  height: 100px;
  background-color: black;
`

class TableComponent extends Component {
  render () {
    return (
      <Table>
        <Tickets>
          {this.props.tickets.map(ticket => (
            <Ticket key={ticket._id} ticket={ticket} />
          ))}
        </Tickets>
        <Buttons>Pagination Will Here!</Buttons>
      </Table>
    )
  }
}

export default TableComponent
