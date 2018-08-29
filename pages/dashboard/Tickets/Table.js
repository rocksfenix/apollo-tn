import React, {Component} from 'react'
import styled from 'styled-components'
import Ticket from './Ticket'
import Loading from './Loading'

const Table = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Tickets = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  position: relative;
  bottom: 100px;
  top: 0;
`

const Buttons = styled.div`
  width: 100%;
  height: 100px;
  background-color: black;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Info = styled.div`
`
const Button = styled.button`
  background-color: #FFF;
  border: 0;
  padding: 1em 2em;
  cursor: pointer;
  opacity: .7;
  transition: 250ms ease-out;

  :hover {
    opacity: 1;
  }
`

class TableComponent extends Component {
  state = {
    currentPage: 0
  }

  componentDidUpdate (nextProps) {
    if (nextProps.allTickets.total !== this.props.allTickets.total) {
      this.setState({ currentPage: 0 })
    }
  }

  onPrevPage = () => {
    if (this.state.currentPage - 1 >= 0) {
      this.setState(state => ({ currentPage: state.currentPage - 1 }), () => this.props.onPrevPage(this.state.currentPage))
    }
  }

  onNextPage = () => {
    const totalItems = this.props.allTickets.total
    const totalPages = Math.ceil(totalItems / this.props.itemsByPage)

    if (this.state.currentPage < totalPages - 1) {
      this.setState(state => ({ currentPage: state.currentPage + 1 }), () => this.props.onNextPage(this.state.currentPage))
    }
  }
  render () {
    const { loading, allTickets } = this.props
    const totalItems = this.props.allTickets.total
    const totalPages = Math.ceil(totalItems / this.props.itemsByPage)

    return (
      <Table>
        <Loading show={loading} />

        <Tickets>
          {allTickets.tickets.map(ticket => (
            <Ticket key={ticket._id} ticket={ticket} {...this.props} />
          ))}
        </Tickets>

        <Buttons>
          <Button onClick={this.onPrevPage}>PREV PAGE</Button>
          <Info>
              Page {this.state.currentPage + 1} of { totalPages } - Total Items { totalItems } - {this.props.itemsByPage} Items By Page
          </Info>
          <Button onClick={this.onNextPage}>NEXT PAGE</Button>
        </Buttons>
      </Table>
    )
  }
}

export default TableComponent
