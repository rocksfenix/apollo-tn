import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Handler = styled.div`
  width: ${props => props.active ? '400px' : '20px'};
  height: 100%;
  position: absolute;
  right: -10px;
  right: ${props => props.active ? '-200px' : '-10px'};
  background: transparent;
  cursor: ew-resize;
  z-index: 900;
  
  &:after {
    transition: all .3s ease-out;
    transition-delay: .4s;
    content: '';
    width: 3px;
    height: 100%;
    background: transparent;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    
  }

  &:hover {
    &:after {
      background: orangered;
      box-shadow: 0px 1px 13px orangered;
    }
  }
`

export default class extends Component {
  static defaultProps = {
    min: 93,
    max: 400,
    initialWidth: 280
  }

  static propTypes = {
    // Define el estado inicial del Width
    initialWidth: PropTypes.number.isRequired,
    // Define el ancho minimo
    // Tomando el punto de origen desde pociciin
    // 0 de la ventana del navegador
    min: PropTypes.number.isRequired,
    // Define la pocicion maxima
    max: PropTypes.number.isRequired,
    // Se ejecuta cuando cambia de tamaño
    // Recive el Size como primer argumento
    onResize: PropTypes.func,
    // Se dispara al soltar el mouseup
    onResizeEnd: PropTypes.func
  }

  state = {
    originalPosX: 0,
    originalWidth: 0,
    size: 'big',
    active: false
  }

  componentWillMount () {
    this.setState({ width: this.props.initialWidth })
  }

  componentDidMount = () => {
    if (process.browser) {
      // this.panel = ReactDOM.findDOMNode(this.refs.panel)
      // this.panel.style.width = this.props.initialWidth + 'px'
      // this.panel.style.height = (window.innerHeight - 55) + 'px'
      // Agregamos el evento para setear el up
      window.addEventListener('mouseup', this.mouseUp)
    }
  }

  mouseDown = (e) => {
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseUp)

    this.setState({ originalPosX: e.clientX, originalWidth: this.state.width, active: true })
  }

  mouseMove= (e) => {
    const { min, max } = this.props
    // Calculamos el movimiento en pixeles
    let diff = this.state.originalWidth + (e.clientX - this.state.originalPosX)
    let size = 'big'

    // Hacemos correcciones
    if (diff > max) { diff = max }
    if (diff <= min) { diff = min }

    if (diff >= 190 && diff < 190) { size = 'big' }
    if (diff > 10 && diff < 170) { size = 'small' }
    // if (diff <= 120) { size = 'small' }

    console.log(size)

    // Se setean los estilos
    // this.panel.style.width = diff + 'px'

    this.setState({ width: diff, size })

    // Hacemos correcciones para que solo se ejecute cuando
    // este entre el rango indicado, pero se suma y resta margenes
    // Porque si no no se ejecuta hasta el final
    const tolerance = 200
    if (this.props.onResize && diff > min - tolerance && diff < max + tolerance) {
      this.props.onResize(diff, size)
    }
  }

  mouseUp = (e) => {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)

    const width = parseFloat(this.state.width)
    // const { min, max } = this.props

    if (this.props.onResize) {
      // Cambio de tamaño
      this.props.onResize(width, this.state.size)
    }

    if (this.props.onResizeEnd) {
      // Cambio de tamaño
      this.props.onResizeEnd(width, this.state.size)
    }

    this.setState({ active: false })
  }
  render () {
    return (
      <Handler
        active={this.state.active}
        onMouseDown={this.mouseDown}
      />
    )
  }
}
