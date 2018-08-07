import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'
import Toggle from './Toggle'

const Panel = styled.div`
  width: 100%;
  display: flex;
  padding: .3em 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
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

export default class extends Component {
  render () {
    console.log(this.props)
    return (
      <Panel>
        <Label>{ this.props.label }</Label>
        <Toggle
          defaultChecked={this.props.active}
          checked={this.props.active}
          onChange={(value) => this.props.onChange(this.props.keyName, value)}
        />
      </Panel>
    )
  }
}
