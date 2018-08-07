import React, {Component} from 'react'
import styled from 'styled-components'
import Toggle from './Toggle'
import LabelField from './LabelField'

const Panel = styled.div`
  width: 100%;
  display: flex;
  padding: .3em 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
`

export default class extends Component {
  render () {
    return (
      <Panel>
        <LabelField>{ this.props.label }</LabelField>
        <Toggle
          defaultChecked={this.props.active}
          checked={this.props.active}
          onChange={(value) => this.props.onChange(this.props.keyName, value)}
        />
      </Panel>
    )
  }
}
