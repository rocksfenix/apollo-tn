import React, {Component} from 'react'
import styled from 'styled-components'

const TextInput = styled.input`
  width: 100%;
  margin: 0 auto;
  min-height: 50px;
  padding: 5px 10px;
  background: #e9f3f5;
  border: 1px solid transparent;
  border-radius: 3px;
  display: block;
  font-size: 16px;
  transition: .3s ease-out;
  overflow: hidden;
  outline: none;
  margin-bottom: 1em;
  font-family: Roboto;
  font-weight: 100;

  &:focus {
    border: 1px solid rgba(0, 129, 255, 1);
    border: 1px solid rgb(94, 46, 146);
  }
`

class Textarea extends Component {
  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.onEnter(e.target.value)
      e.target.value = ''
    }
  }

  render () {
    return (
      <TextInput
        placeholder='Add note'
        onKeyPress={this.onEnter}
        ref={(input) => { this.input = input }}
      />
    )
  }
}

export default Textarea
