import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'
import LabelField from './LabelField'

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

    if (props.size === 'medium') {
      return '2px 14px'
    }

    if (props.size === 'small') {
      return '1px 14px'
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

    if (props.size === 'small') {
      return '12px'
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
  justify-content: space-around;
  align-items: center;
  padding: .3em 0;
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
    const { inputWidth, borderBottom, borderRight } = this.props
    return (
      <Panel
        style={{
          'border-bottom': borderBottom || '',
          'border-right': borderRight || ''
        }}
      >
        <LabelField> { this.props.label } </LabelField>
        <Input
          style={{
            width: inputWidth || '80%'
          }}
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
