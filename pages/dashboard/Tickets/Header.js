import React, {Component} from 'react'
import styled from 'styled-components'

const Header = styled.header`
  width: 100%;
  height: 100px;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 30%;
  min-width: 500px;
`
const ButtonEl = styled.button`
  border: 0;
  background-color: ${p => p.active ? '#6bcf00' : '#444344'};
  color: #FFF;
  border-radius: 3px;
  padding: .3em 1.6em;
  outline: none;
  cursor: pointer;
  transition: background .3s ease-out;
`

class Button extends Component {
  handleClick = () => {
    this.props.onFilter(this.props.value)
  }

  render () {
    return (
      <ButtonEl
        active={this.props.active === this.props.value}
        onClick={this.handleClick}>
        {this.props.children}
      </ButtonEl>
    )
  }
}

export default ({ onFilter, filter }) => {
  return (
    <Header>
      <Buttons>
        <Button onFilter={onFilter} value='new' active={filter}>New</Button>
        <Button onFilter={onFilter} value='working' active={filter}>Working</Button>
        <Button onFilter={onFilter} value='completed' active={filter}>Completed</Button>
        <Button onFilter={onFilter} value='all' active={filter}>All</Button>
      </Buttons>
    </Header>
  )
}
