import React, { Component } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Logo from '../../Logo'
import Icon from '../../Icon'
import MenuBlock from './../MenuBlock'
import ScrollLock from 'react-scrolllock'

const A = styled.a`
  color: #FFF;
  font-weight: 300;
`

const Panel = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0e1013;
  padding: 0 1em;

  @media (min-width: 900px) {
    display: none;
  }
`

const Blink = ({ href, children }) => (
  <Link href={href} passHref>
    <A>{ children }</A>
  </Link>
)

const Button = styled.button`
  position: relative;
  z-index: 10000;
  color: #FFF;
  height: 100%;
  width: 60px;
  border: 0;
  outline: none;
`

const MobileMenu = styled.div`
  width: 80vw;
  height: 100vh;
  z-index: 1000 !important;
  position: fixed;
  top: 0;
  right: ${props => props.show ? '0' : '-100%'};
  background: rgba(0,0,0,0.9);
  transition: right 250ms ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Options = styled.nav`
  border-left: 1px solid #079fb8;
  width: 80%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 22px;
  justify-content: space-around;
  

  @media (max-height: 500px) and (orientation: landscape) {
    height: 250px;
    justify-content: space-around;
  }
`

const To = styled.a`
  color: #2586ff;
  transition: all .3s ease-out;
  width: 100%;
  text-align: center;

  &:hover {
    color: orange;
  }

  @media (max-width: 900px) {
    font-size: 20px;
  }
`

const Pro = () => (
  <Link href={`/pro`} passHref>
    <To> PRO <i className='icon-thunder-1' /></To>
  </Link>
)

const Public = () => (
  <Options>
    <Blink href={`/cursos`}> Cursos </Blink>
    <Blink href={`/registro`}> Unete </Blink>
    <Pro />
    <Blink href={`/login`}> Login </Blink>
  </Options>
)

class Mobile extends Component {
  state = {
    showResponsive: false
  }

  toggleMenu = () => {
    this.setState(({ showResponsive }) => ({
      showResponsive: !showResponsive
    }))
  }

  render () {
    const { showResponsive } = this.state
    const { user } = this.props

    return (
      <Panel>
        <Logo href='/' passHref />
        { showResponsive ? <ScrollLock /> : ''}
        <Button onClick={this.toggleMenu}>
          { showResponsive ? <Icon type='cross' /> : <Icon type='menu2' /> }
        </Button>
        <MobileMenu show={showResponsive}>
          { user.role
            ? <MenuBlock show user={user} />
            : <Public />
          }
        </MobileMenu>
      </Panel>
    )
  }
}

export default Mobile
