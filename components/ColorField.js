import React, {Component} from 'react'
import styled from 'styled-components'
import { HuePicker, ChromePicker } from 'react-color'

const Panel = styled.div`
  width: 100%;
  padding: 0.3em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
  position: relative;
`

const Label = styled.div`
  width: 30%;
  color: #151517;
  font-size: 13px;
  font-family: Roboto;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  componentWillMount () {
    if (this.props.color) {
      this.setState({ color: this.props.color })
    }
  }

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
        <Label>
          { this.props.label }
          <Box style={{background: this.state.color}} onClick={this.toggle} />
        </Label>
        <HuePicker
          color={this.state.color}
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
