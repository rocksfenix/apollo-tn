import React, { Component } from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  top: -80px;
  z-index: 500;
  color: #FFF;
  font-family: Roboto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: all .3s ease-out;
`

const CloseBtn = styled.div`
  cursor: pointer;
  transition: transform 200ms ease-out;

  &:hover {
    transform: scale(1.5);
  }
`

class NotificationComponent extends Component {
  componentWillReceiveProps (nextProps, nextState) {
    // if (nextProps.show) {
    //   // Cuando sea show iniciamos el timer
    //   this.timer = setTimeout(this.close, 35000)
    // } else {
    //   // Si no lo limpiamos
    //   clearTimeout(this.timer)
    // }
  }

  close = () => {
    this.props.close({
      show: false,
      message: this.props.message
    })
  }

  render () {
    const { show, type, message } = this.props

    let bgColor = 'black'

    if (type === 'error') { bgColor = '#ff6000' }
    if (type === 'warning') { bgColor = '#e0b127' }
    if (type === 'info') { bgColor = '#27c5e0' }
    if (type === 'success') { bgColor = '#aad214' }

    const style = {
      background: bgColor,
      top: show ? '0px' : '-60px'
    }

    return (
      <Bar style={style}>
        <span>{message}</span>
        <CloseBtn onClick={this.close}>
          <i className='icon-cross' />
        </CloseBtn>
      </Bar>
    )
  }
}

export default NotificationComponent
