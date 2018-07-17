import React, {Component} from 'react'
import { string, func } from 'prop-types'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'
import Icon from './Icon'

const Input = styled.input`
  width: 100%;
  padding: 11px 15px;
  position: relative;
  z-index: 1;
  background: rgba(212, 222, 224, 0.48);
  border: 1px solid transparent;
  border-radius: 3px;
  display: block;
  font-family: Roboto;
  font-size: 18px;
  transition: .25s ease-out;

  &:focus {
    outline: none;
  }
`

const Panel = styled.span`
  width: 100%;
  max-width: 368px;
  display: block;
  position: relative;
  z-index: 1;
  margin: 1em auto;
  box-sizing: border-box;

`
const Label = styled.label`
  color: #151517;
  font-size: 18px;
  font-family: Roboto;
  font-weight: 300;
  padding: Initial;
  background: transparent;
  letter-spacing: 1px;
  margin-left: 16px;
  text-transform: capitalize;
  text-align: left;
  position: absolute;
  z-index: -1;
  bottom: 50%;
  transform: translateY(50%);
  display: inline-block;
`

const ErrorMessage = styled.div`
  width: 100%;
  background-color: #f93d5c;
  border-radius: 3px;
  color: #FFF;
  padding: .4em;
  font-family: Roboto;
  font-size: 14px;
`

class TextFieldComponent extends Component {
  static propTypes = {
    label: string,
    size: string,
    onChange: func
  }

  static defaultProps = {
    value: '',
    minLength: 4,
    type: 'text'
    // pattern: /[^@]+@[^@]+\.[a-zA-Z]{2,}/g
  }

  state = {
    isActive: false,
    error: false,
    success: false,
    isTouched: false
  }

  componentWillMount () {
    if (this.props.value !== '') {
      this.setState({ isActive: true })
    }
  }

  onChange = (e) => {
    const { field } = this.props
    const { value } = e.target

    if (this.props.onChange) {
      this.props.onChange(field, value)
    }

    this.validate()
  }

  onFocus = (e) => {
    this.setState({ isActive: true })
  }

  onBlur = (e) => {
    if (!this.state.isTouched) {
      this.setState({ isTouched: true })
    }

    // Solo se desactiva cuando el string es vacio
    if (this.props.value.length === 0) {
      this.setState({ isActive: false })
    }

    this.validate()
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.props.onEnter) {
      const { field } = this.props
      const { value } = e.target
      this.props.onEnter(field, value)
    }
  }

  onValidate = (v) => {
    this.props.onValidate(this.props.field, v)
  }

  // Se ejecuta cuanto la entrada es correcta
  onSuccess = () => {
    this.setState({ error: false, success: true })

    if (this.props.onSuccess) {
      this.props.onSuccess(this.props.field)
    }
  }

  onError = () => {
    if (this.props.onError) {
      this.props.onError(this.props.field)
    }
  }

  validate = debounce(450, () => {
    // Se esta escribiendo por primera vez
    if (!this.state.isTouched) {
      if (this.hasErrors()) {
        this.setState({ error: false, success: false })
      } else {
        this.onSuccess()
        this.onValidate(true)
      }
    } else {
      if (this.hasErrors()) {
        this.setState({ error: true, success: false })
      } else {
        this.onSuccess()
        this.onValidate(true)
      }
    }
  })

  hasErrors = () => {
    const { pattern, minLength, value } = this.props
    if (typeof pattern !== 'undefined') {
      if (value.search(pattern) < 0) {
        this.onError()
        this.onValidate(false)
        return true
      }
    }

    if (typeof minLength !== 'undefined') {
      if (value.length < minLength) {
        this.onError()
        this.onValidate(false)
        return true
      }
    }

    return false
  }

  render () {
    const { isActive, error, success, isTouched } = this.state
    // console.log(this.props.label, this.state)
    let border = '1px solid transparent'
    let color = '#151517'

    if (isActive) {
      border = '1px solid #7e898b'
      color = '#7e898b'
    }

    if (error) {
      border = '1px solid red'
      color = 'red'
    }

    if (success) {
      border = '1px solid #2ac84f'
      color = '#2ac84f'
    }
    // console.log(border)

    const styles = {
      Input: {
        background: isActive || isTouched ? 'transparent' : 'rgba(212, 222, 224, 0.48)',
        border,
        color
      },

      Label: {
        color,
        fontSize: isActive ? '15px' : '18px',
        padding: isActive ? '0 .5em' : 'Initial',
        background: isActive ? '#FFF' : 'transparent',
        zIndex: isActive ? 2 : -1,
        bottom: isActive ? '100%' : '50%',
        transition: isActive ? 'all 0.2s ease-out' : ''
      }
    }

    return (
      <Panel>
        {/* <ErrorMessage><Icon type='bug' size='9px' />Error Message</ErrorMessage> */}
        <Input
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          spellCheck='false'
          value={this.props.value}
          size={this.props.size}
          style={styles.Input}
          type={this.props.type}
        />
        <Label
          style={styles.Label}
        >
          { this.props.label }
        </Label>
      </Panel>
    )
  }
}

export default TextFieldComponent
