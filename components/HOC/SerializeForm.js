import React, {Component} from 'react'
import includes from 'lodash/includes'

const getInitialState = (keys) => {
  const acc = {
    data: {},
    validate: {}
  }

  keys.forEach(k => {
    acc.data[k.field] = ''
    acc.validate[k.field] = false
  })
  return acc
  // email: '',
  //   validate: {
  //     email: false
  //   }
}

export default (keys, Comp) => class extends Component {
  state = getInitialState(keys)

  log = () => {
    console.log(this.state)
  }

  onChange = (key, val) => this.setState(state => ({
    ...state,
    data: { ...state.data, [key]: val }
  }))

  onValidate = (key, val) => this.setState(state => ({
    ...state,
    validate: { ...state.validate, [key]: val }
  }))

  allValid = () => {
    return !includes(this.state.validate, false)
  }

  checkValidations = () => {
    let hasError = null
    keys.forEach(k => {
      if (this.state.validate[k.field] === false) {
        hasError = k.message
      }
    })

    if (hasError) {
      return hasError
    }

    return false
  }

  render () {
    return (
      <Comp
        log={this.log}
        data={{...this.state.data}}
        onChange={this.onChange}
        onValidate={this.onValidate}
        allValid={this.allValid}
        checkValidations={this.checkValidations}
      />
    )
  }
}
