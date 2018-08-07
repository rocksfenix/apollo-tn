import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'

const Input = styled.input`
  width: 80%;
  padding: 8px 15px;
  padding: ${props => {
    if (props.size === 'big') {
      return '8px 15px'
    }

    if (props.size === 'medium') {
      return '4px 15px'
    }
  }};
  background: #e9f3f5;
  border: 1px solid transparent;
  border-radius: 3px;
  display: block;
  font-family: Roboto;
  font-size: ${props => {
    if (props.size === 'big') {
      return '20px'
    }

    if (props.size === 'medium') {
      return '14px'
    }
  }};
  transition: .25s ease-out;

  &:focus {
    border: 1px solid rgba(0, 129, 255, 1);
    border: 1px solid rgb(94, 46, 146);
    background: #FFF;
    outline: none;
  }
`

const Panel = styled.div`
  width: 100%;
  display: flex;
  padding: .3em 0;
`
const Label = styled.div`
  width: 30%;
  color: #151517;
  font-size: 13px;
  margin-bottom: 4px;
  margin-top: 1em;  
  font-family: Roboto;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: left;
`

class TextFieldComponent extends Component {
  static propTypes = {
    label: string,
    size: string,
    onChange: func
  }

  static defaultProps = {
    value: ''
  }
  onChange = (e) => {
    const { keyName } = this.props
    const { value } = e.target

    if (this.props.onChange) {
      this.props.onChange(keyName, value)
    }
  }

  render () {
    return (
      <Panel>
        <Label> { this.props.label } </Label>
        <Input
          onChange={this.onChange}
          spellCheck='false'
          value={this.props.value}
          size={this.props.size}
        />
      </Panel>
    )
  }
}

export default TextFieldComponent
