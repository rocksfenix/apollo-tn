import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'

const Input = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 5px 10px;
  background: #e9f3f5;
  border: 1px solid transparent;
  border-radius: 3px;
  display: block;
  font-family: Roboto;
  font-size: 14px;
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
const Label = styled.div`
  width: 30%;
  color: #151517;
  font-size: 13px;
  margin-bottom: 4px;
  margin-top: 1em;
  font-family: Roboto;
  letter-spacing: 1px;
  /* margin-left: 16px; */
  text-transform: uppercase;
  text-align: left;
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
        <Label>{ label }</Label>
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
