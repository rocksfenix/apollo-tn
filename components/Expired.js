import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Notification = styled.div`
  position: absolute;
  top: 55px;
  width: 100%;
  height: 50px;
  background-color: yellow;
  display: ${props => props.show ? 'block' : 'none'};
`

const Icon = styled.i`
  position: absolute;
  right: 10px;
  color: rgba(0,0,0,1);
  opacity: .6;
  padding: 16px 20px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`

const Message = styled.div`
  position: absolute;
  left: 20px;
  top: 12px;
`

const A = styled.a`
  margin-left: 5px;
  cursor: pointer;
`

class NotificationComponent extends Component {
  state = {
    show: true
  }

  close = () => this.setState({ show: false })

  render () {
    return (
      <Notification show={this.state.show}>
        <Message>
          {/* Se ha expirado la secion pueder ingresar nuevamente desde */}
          Lamentamos que no estes de acuerdo con nuestra Politica de Privacidad y Terminos de uso, se ha cerrado tu sesion.
          {/* <Link href='/login'>
            <A>Login</A>
          </Link> */}
        </Message>
        <Icon className='icon-cross' onClick={this.close} />
      </Notification>
    )
  }
}

export default NotificationComponent
