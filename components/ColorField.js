import React, {Component} from 'react'
import styled from 'styled-components'
import { HuePicker, ChromePicker } from 'react-color'
import LabelField from './LabelField'

const Panel = styled.div`
  width: 100%;
  padding: 0.3em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
  position: relative;
`

const Picker = styled.div`
  position: absolute;
  top: 30px;
`

const Box = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 2px;
  margin-right: 1em;
`

export default class extends Component {
  state = {
    displayPicker: false,
    color: '#9cb6b5'
  }

  // componentWillMount () {
  //   if (this.props.color) {
  //     this.setState({ color: this.props.color })
  //   }
  // }

  // component

  toggle = () => this.setState(state => ({
    ...state,
    displayPicker: !state.displayPicker
  }))

  handleChange = (color) => {
    this.setState({ color: color.hex })
    this.props.onChange(this.props.keyName, color.hex)
  }

  render () {
    return (
      <Panel>
        <LabelField>
          { this.props.label }
          <Box style={{background: this.props.color}} onClick={this.toggle} />
        </LabelField>
        <HuePicker
          color={this.props.color}
          onChange={this.handleChange}
        />
        {
          this.state.displayPicker
            ? <Picker>
              <ChromePicker
                color={this.state.color}
                onChange={this.handleChange}
                onChangeComplete={this.handleChangeComplete}
              />
            </Picker>
            : null
        }
      </Panel>
    )
  }
}
