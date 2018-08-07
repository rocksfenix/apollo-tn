import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'
import LabelField from './LabelField'

const Panel = styled.div`
  width: 100%;
  padding: 0.3em 0;
  display: flex;
  border-bottom: 1px solid #e9f3f5;
`

const Options = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const Option = styled.button`
  border: 0;
  background: ${p => p.active ? '#26242e' : '#e9f3f5'};
  color: ${p => p.active ? '#FFF' : '#000'};
  padding: 0 1em;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  height: 25px;
`
export default class extends Component {
  render () {
    return (
      <Panel>
        <LabelField>{this.props.label}</LabelField>
        <Options>
          {this.props.options.map(option => (
            <Option
              key={option.value}
              onClick={() => this.props.onChange(this.props.keyName, option.value)}
              active={this.props.active === option.value}>
              { option.value }
            </Option>
          ))}
        </Options>
      </Panel>
    )
  }
}
