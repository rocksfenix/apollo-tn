
import React, { Component } from 'react'
import styled from 'styled-components'
import DOM from 'react-dom'

import Icon from '../Icon'

const Text = styled.div`
  /* background-color: #f6edff; */
  margin: 1em;
  padding: 1em;
  border-radius: 5px;
  font-weight: 100;
  background-color: #d9fff4;
  background: ${p => {
    if (p.status === 'new') return '#ffe2ca'
    if (p.status === 'working') return '#c7fff'
    if (p.status === 'completed') return '#efffc7'
  }};
  margin: 1em;
  padding: .3em;
  font-family: 'Open Sans',sans-serif;
  -webkit-letter-spacing: -.003em;
  -moz-letter-spacing: -.003em;
  -ms-letter-spacing: -.003em;
  letter-spacing: -.003em;
  line-height: 1.58;
  font-size: 15px;
  border-radius: 5px;
`
const Textarea = styled.textarea`
  border: 1px solid #f6edff;
  width: 95%;
  display: block;
  margin: 1em;
  padding: 1em;
  border-radius: 5px;
  outline: none;
`

const Panel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const RemoveBtn = styled.button`
  width: 5%;
  border: 0;
  background-color: #ffdede;
  color: #cb6c6c;
  height: 50px;
  cursor: pointer;
  outline: none;
  

  &: hover {
    background: tomato;
    color: #FFF;
  }
`

class TicketText extends Component {
  state = { isEditing: false }

  componentDidMount () {
    const input = DOM.findDOMNode(this.input)

    if (input) {
      input.focus()
      input.value = this.props.ticket.text
      this.input = input
    }
  }

  activeEdit = () => this.setState({ isEditing: true })

  handleKeyPress = (e) => {
    if (e.keyCode === 27) {
      // Escape
      this.setState({ isEditing: false })
    }

    if (e.key === 'Enter') {
      const ticket = {
        text: e.target.value,
        _id: this.props.ticket._id
      }
      this.setState({ isEditing: false })
      this.props.onConfirm(ticket)
    }
  }

  remove = () => {
    this.props.onDelete(this.props.ticket._id)
    this.setState({ isEditing: false })
  }

  render () {
    const { isEditing } = this.state
    const { ticket } = this.props
    console.log(ticket)
    if (isEditing) {
      return (
        <Panel>
          <Textarea
            defaultValue={ticket.text}
            ref={input => { this.input = input }}
            onKeyDown={this.handleKeyPress}
          />
          <RemoveBtn onClick={this.remove}>
            <Icon type='remove' margin='0' />
          </RemoveBtn>
        </Panel>
      )
    }

    return (
      <Text
        onDoubleClick={this.activeEdit}
        status={ticket.status}>
        { ticket.text }
      </Text>
    )
  }
}

export default TicketText
