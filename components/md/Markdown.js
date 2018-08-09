// Este modulo parsea el markdown y retorna el marcado
import React, { Component } from 'react'
import md from '../md'

export default class extends Component {
  state = {
    hasError: false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.markdown !== this.props.markdown) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch () {
    this.setState({ hasError: true })
  }

  render () {
    const { hasError } = this.state
    if (hasError) {
      return <h1>Error en markdown</h1>
    }
    return md(this.props.markdown)
  }
}
