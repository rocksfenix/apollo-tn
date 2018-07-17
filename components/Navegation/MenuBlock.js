/*
 * Menublock Se comparte entre el Desktop y el Mobile
 *
*/

import React from 'react'
import styled, { keyframes } from 'styled-components'
import _Link from 'next/link'
import getDisplayName from './getDisplayName'
import { logout } from '../../lib/session'
import Icon from '../Icon'

const Options = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: #21252B;
  background: rgba(0, 0, 0, 0.80);
  position: absolute;
  top: 0;
  display: ${props => props.show ? 'flex' : 'none'};
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  box-shadow: 0px 6px 35px rgba(0,0,0,0.5);
`

const HeaderPanel = styled.div`
  width: 100%;
  height:100px;
  background: #001e42;
  background: linear-gradient(-210deg, black, #0074ff);
  background: linear-gradient(-210deg, black, #484dff);
  position: relative;
  top: -5px;

  @media (max-width: 900px) {
    height:25%;
    position: absolute;
    top: 0;
  }
`

const HeaderPanelName = styled.div`
  width: 100%;
  height: 60px;
  background: rgba(0,0,0,0.5);
  color: #FFF;
  font-size: 18px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    height: 70%;
  };
`

const RotateAnimation = keyframes`
  0% {
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
  }

  100% {
    transform: translateX(-50%) translateY(-50%) rotate(365deg);
  }
`

const Arm = styled.img`
  width: 90px;
  height: 90px;
  position: absolute;
  top: 36%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  opacity: .3;
  animation: 4s linear ${RotateAnimation} infinite;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Username = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    font-size: 27px;
  };
`

const Role = styled.div`
  padding: 0.1em .5em;
  background: #0c64d2;
  border-radius: 3px;
  font-size: 12px;
  margin-left: .5em;
  margin-right: .5em;

  @media (max-width: 900px) {
    font-size: 16px;
  };
`

const Points = styled.div`
  font-size: 12px;
  margin-left: .5em;
  margin-right: .5em;

  @media (max-width: 900px) {
    font-size: 16px;
    margin-left: .7em;
    margin-right: .7em;
  };
`

const Header = ({ user }) => (
  <HeaderPanel>
    <Arm src='/static/ninja-arm-1.svg' />
    <HeaderPanelName>
      <Username><Icon type='thunder-4' />{ getDisplayName(user.fullname) }</Username>
      <Row>
        <Role><Icon type='star-2' size='11px' />{ user.role }</Role>
        <Points>185 Puntos</Points>
      </Row>
    </HeaderPanelName>
  </HeaderPanel>
)

const Desktop = styled.div`
  width: 80%;
  height: 100px;
  padding-left: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #079fb8;
  transition: .3s ease-out;

  @media (max-width: 900px) {
    display: none;
  };
`

const Mobile = styled.div`
  width: 80%;
  height: 50%;
  padding-left: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #079fb8;
  transition: .3s ease-out;

  @media (min-width: 900px) {
    display: none;
  };
`

const Option = styled.a`
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  color: #FFF;
  transition: all .3s ease-out;

  &:hover {
    opacity: .3;
  }

  @media (max-width: 900px) {
    font-size: 20px;
  };
`

const Link = (props) => (
  <_Link href={props.href} passHref>
    <Option {...props}>{ props.children }</Option>
  </_Link>
)

const To = styled.a`
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  color: #FFF;
  transition: all .3s ease-out;
  display: none;

  &:hover {
    color: orange;
  }

  @media (max-width: 900px) {
    display: block;
    font-size: 20px;
  }
`

const Pro = () => (
  <Link href={`/pro`}>
    <To style={{ color: '#2586ff' }}> PRO <i className='icon-thunder-1' /></To>
  </Link>
)

const MenuBlock = ({ show, user }) => {
  return (
    <Options show={show}>
      <Header user={user} />
      <Desktop>
        <Link href='/cuenta'>Cuenta</Link>
        <Link onClick={logout}>Cerrar sesión</Link>
      </Desktop>

      <Mobile>
        <Link href='/cursos'>Cursos</Link>
        { user.role === 'free' ? <Pro /> : null }
        <Link href='/cuenta'>Cuenta</Link>
        <Link onClick={logout}>Cerrar sesión</Link>
      </Mobile>
    </Options>
  )
}

export default MenuBlock
