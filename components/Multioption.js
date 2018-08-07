import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'

const Panel = styled.div`
  width: 100%;
  padding: 0.3em 0;
  display: flex;
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
  /* margin-left: 16px; */
  text-transform: uppercase;
  text-align: left;
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
  font-size: 13px;
  cursor: pointer;
  height: 30px;
`
export default class extends Component {
  render () {
    return (
      <Panel>
        <Label>{this.props.label}</Label>
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
