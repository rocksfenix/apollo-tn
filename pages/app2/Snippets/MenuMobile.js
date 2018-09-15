import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler'

const Anima = keyframes`
  0% {
    transform: scale(.8)
  }
  100% {
    transform: scale(1)
  }
`

const Button = styled.button`
  border: 0;
  background: transparent;
  color: #FFF;
`

const MenuMobile = styled.div`
  display: ${p => p.show ? 'flex' : 'none'};
  animation: 150ms ease-out ${Anima};
  transform-origin: 0% 0%;
  will-change: transform;
  width: 200px;
  height: 250px;
  background-color: #FFF;
  border-radius: 5px;
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 100;
  box-shadow: 6px 4px 52px #3F51B5;
`

export default class extends Component {
  state = { showMobileMenu: false }

  showMobileMenu = () => {
    this.setState({ showMobileMenu: true })
  }

  hideMobileMenu = () => {
    this.setState({ showMobileMenu: false })
  }

  render () {
    return (
      <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
        <Button onClick={this.showMobileMenu}>
          <i className='icon-menu' /> =
        </Button>
        <MenuMobile show={this.state.showMobileMenu}>
          ( ) - Curso > Leccion
        </MenuMobile>
      </OutsideClickHandler>
    )
  }
}
