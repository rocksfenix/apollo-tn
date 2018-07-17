import React from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import Icon from '../../Icon'
import Logo from '../../Logo'
import Menu from './Menu'

const Bar = styled.nav`
  font-weight: 300;
  display: flex;
  z-index: 100;
  width: 100%;
  height: 55px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0e1013;

  @media (max-width: 900px) {
    display: none;
  }
`
const Left = styled.div`
  float: left;
  width: 350px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const Right = styled.div`
  float: right;
  width: 350px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const To = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: ${props => props.color || '#FFF'};
  transition: all .3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  margin: 0 10px;
  height: 100%;
  padding: 0 3px 0 3px;
  font-size: 16px;
  opacity: .8;

  &:hover {
    opacity: .3;
  }
`

const ToPro = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  color: #524ebf !important;
  height: 100%;
  padding: 0 3px 0 3px;
  cursor: pointer;
  font-size: 17px;

  /* Icon */
  & i {
    color: #524ebf !important;
    transition: all .3s ease-out;
    margin-left: 5px;
  }

  &:hover {
    color: orange !important;
  }

  &:hover > i {
    color: orange !important;
  }
`

const Link = ({ href, children, resalt, style }) => (
  <NextLink passHref href={href}>
    { resalt
      ? <ToPro style={style}>{ children }</ToPro>
      : <To style={style}>{ children }</To>
    }
  </NextLink>
)

const Public = ({user}) => (
  <Bar>
    <Left>
      <Link href='/home' as='/'><Logo /></Link>
      <Link href='/cursos'>Cursos</Link>
    </Left>
    <Right>
      <Link href='/pro' resalt><Icon type='thunder-1' />PRO</Link>
      <Link href='/registro'> Unete</Link>
      <Link href='/login'>Login</Link>
    </Right>
  </Bar>
)

const Admin = ({user}) => (
  <Bar>
    <Left>
      <Link href='/home' as='/'><Logo /></Link>
      <Link href='/cursos'>Cursos</Link>
    </Left>
    <Right>
      <Link href='/dashboard'>Dashboard</Link>
      <Menu user={user} />
    </Right>
  </Bar>
)

const Free = ({user}) => (
  <Bar>
    <Left>
      <Link href='/home' as='/'><Logo /></Link>
      <Link href='/cursos'>Cursos</Link>
    </Left>
    <Right>
      <Link href='/pro' resalt><Icon type='thunder-1' /> PRO</Link>
      <Menu user={user} />
    </Right>
  </Bar>
)

const Pro = ({user}) => (
  <Bar>
    <Left>
      <Link href='/home' as='/'><Logo /></Link>
      <Link href='/cursos'>Cursos</Link>
    </Left>
    <Right>
      <Menu user={user} />
    </Right>
  </Bar>
)

const Desktop = ({ user }) => {
  switch (user.role) {
    case 'admin':
      return <Admin user={user} />

    case 'free':
      return <Free user={user} />

    case 'pro':
      return <Pro user={user} />

    default:
      return <Public />
  }
}

// Desktop.defaultProps = {
//   user: {
//     role: ''
//   }
// }

export default Desktop
