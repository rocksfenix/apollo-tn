import React, { Component } from 'react'
import styled from 'styled-components'
import MenuBlock from '../MenuBlock'
import getDisplayName from '../getDisplayName'
import Icon from '../../Icon'
const Panel = styled.div`
  width: 200px;
  height: 55px;
  transition: all .3s ease-out;
  position: relative;
`

const NameBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
`

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  background: black;
  border-radius: 50%;
  background: gray url(${props => props.src});
  background-size: cover;
`

const Name = styled.div`
  font-size: 14px;
  color: #FFF;
`

class MenuComponent extends Component {
  state = { show: false }

  over = () => this.setState({ show: true })

  leave = () => this.setState({ show: false })

  render () {
    const { user } = this.props
    const { show } = this.state
    return (
      <Panel
        onMouseOver={this.over}
        onMouseLeave={this.leave}
      >
        <NameBox>
          <Avatar src={user.avatar.small} />
          <Name>{ getDisplayName(user.fullname) }</Name>
          <Icon type='clip' size='12px' color='#FFF' />
        </NameBox>
        <MenuBlock
          show={show}
          user={user}
        />
      </Panel>
    )
  }
}

export default MenuComponent
