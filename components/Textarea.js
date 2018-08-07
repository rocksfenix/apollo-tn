import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'
import LabelField from './LabelField'

const Input = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 5px 10px;
  background: #e9f3f5;
  border: 1px solid transparent;
  border-radius: 3px;
  display: block;
  font-family: Roboto;
  font-size: 12px;
  transition: .3s ease-out;
  overflow: hidden;

  &:focus {
    border: 1px solid rgba(0, 129, 255, 1);
    border: 1px solid rgb(94, 46, 146);
    background: #FFF;
  }
`

const Panel = styled.div`
  width: 100%;
  margin: 10px auto;
`

const propTypes = {
  label: string,
  onChange: func,
  value: string,
  size: string
}

class AreaComponent extends Component {
  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    const { value } = e.target

    if (this.props.onChange) {
      this.props.onChange(this.props.keyName, value)
    }
  }

  render () {
    const { label, value, size } = this.props
    return (
      <Panel>
        <LabelField>{ label }</LabelField>
        <Input
          onChange={this.onChange}
          spellCheck='false'
          value={value}
          size={size}
        />
      </Panel>
    )
  }
}

AreaComponent.propTypes = propTypes

export default AreaComponent
