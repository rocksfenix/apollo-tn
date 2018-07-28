import React, {Component} from 'react'
import Mousetrap from 'mousetrap'
// import styled, {keyframes} from 'styled-components'
import Box from './Box'

export default class extends Component {
  componentDidMount = () => {
    // TODO - Hacer que se puedan manupular
    // Desde el teclado con las flechas
    if (process.browser) {
      Mousetrap.bind('down', () => window.alert('btm'))
    }
  }

  componentWillUnmount () {
    Mousetrap.unbind('down')
  }

  render () {
    const _themes = Object.keys(this.props.themes)

    return (
      <Box>
        <ul>
          {_themes.map(t => (
            <li
              key={t}
              onClick={() => { this.props.onChangeTheme(t) }}
            >{ t }</li>
          ))}
        </ul>
      </Box>
    )
  }
}
