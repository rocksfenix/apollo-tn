import React, {Component} from 'react'
import styled from 'styled-components'
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

const Loading = styled(Tickets)`
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
    const { loading } = this.props
    const totalItems = this.props.allTickets.total
    const totalPages = Math.ceil(totalItems / this.props.itemsByPage)

    return (
      <Table>
        { loading
          ? <Loading>.... Loading</Loading>
          : (
            <Tickets>
              {this.props.allTickets.tickets.map(ticket => (
                <Ticket key={ticket._id} ticket={ticket} {...this.props} />
              ))}
            </Tickets>
          )
        }
        <Buttons>
          {/* TOtal de paginas */}
          Total Pages { totalPages } - Total Items { totalItems } - ItemsByPage {this.props.itemsByPage}
          <button onClick={this.onPrevPage}>PREV PAGE</button>
          <button onClick={this.onNextPage}>NEXT PAGE</button>
        </Buttons>
      </Table>
    )
  }
}

export default TableComponent
