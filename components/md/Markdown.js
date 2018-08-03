// Este modulo parsea el Markup y retorna el marcado
import React, { Component } from 'react'
import md from './index'

export default class extends Component {
  state = {
    hasError: false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.markup !== this.props.markup) {
      this.setState({ hasError: false })
    }
  }

  componentDidCatch () {
    this.setState({ hasError: true })
  }

  render () {
    // console.log(this.props.children)
    // return <div>
    //   { this.props.children }
    // </div>
    const { hasError } = this.state
    if (hasError) {
      return <h1>Error en Markup</h1>
    }
    return md(this.props.markdown)
  }
}
