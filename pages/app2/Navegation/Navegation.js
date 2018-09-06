import React, {Component} from 'react'
import styled from 'styled-components'
import Avatar from '../../../components/Avatar'

const Panel = styled.div`
  position: fixed;
  top: 0;
  transform: ${p => p.show ? 'translateX(0px)' : 'translateX(-55px)'};
  width: 0;
  height: 100vh;
  z-index: 1500;
  background-color: ${props => props.bg};
  color: #aaa;
  width: 55px;
  will-change: transform;
  transition: transform .2s cubic-bezier(1,0,0,1);
  overflow-y: auto;
  overflow-x: hidden;
`

const Image = styled.img`
  width: 30px;
`

const BrandItem = styled.div`
  width: 200px;
  height: 55px;
  border-bottom: 1px solid black;
  display: flex;
  align-items: center;
`

const ItemText = styled.div`
  position: relative;
  transition: all .2s ease-out;
  left: ${props => props.show ? '0px' : '20px'};
  height: 55px;
  display: flex;
  align-items: center;
`

const ItemBox = styled.div`
  width: 55px;
  height: 55px;
  position: relative;
  color: #9389f7;
  color: ${props => props.pasiveColor};

  &:hover {
    &>div>i {
      color: #43f7ff;
      color: ${props => props.activeColor};
    }
  }
`

const IconBox = styled.div`
  height: 55px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  font-size: 22px;
  color: ${props => props.active ? props.activeColor : props.pasiveColor};
`

const Glow = styled.div`
 width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: ${props => `0 0 33px 10px ${props.shadow}`};
  background: ${props => `${props.bg}`};
  filter: blur(5px);
  opacity: .5;
`

const AvatarBox = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Item = ({ label, icon, activeTab, onChangeTab, theme }) => {
  const isActive = label === activeTab
  return (
    <div>
      <ItemBox
        active={isActive}
        onClick={() => onChangeTab(label)}
        activeColor={theme.icon.active}
        pasiveColor={theme.icon.pasive}
      >
        {
          isActive
            ? <Glow bg={theme.glow.bg} shadow={theme.glow.shadow} />
            : null
        }
        <IconBox
          active={isActive}
          activeColor={theme.icon.active}
          pasiveColor={theme.icon.pasive}
        >
          <i className={'icon-' + icon} />
        </IconBox>
        <ItemText>{ label }</ItemText>
      </ItemBox>
    </div>
  )
}

class Navbar extends Component {
  state = {
    width: '55px',
    show: false
  }
  render () {
    return (
      <Panel
        bg={this.props.theme.bar.bg}
        {...this.props}
      >
        <BrandItem onClick={() => this.props.onChangeTab('home')}>
          <IconBox>
            <Image
              src='/static/tecninja.io-logo.svg'
              alt='Logo de Tecninja.io'
            />
          </IconBox>
        </BrandItem>

        <Item label='history' icon='history' {...this.props} />
        <Item label='search' icon='search' {...this.props} />
        {/* El play solo se muestra si esta viendo un curso */}
        {
          this.props.course
            ? <Item label='course' icon='play-2' {...this.props} />
            : null
        }
        <Item label='courses' icon='courses' {...this.props} />
        <Item label='snippets' icon='snippet' {...this.props} />
        <Item label='notes' icon='notes' {...this.props} />
        <Item label='pro' icon='thunder' {...this.props} />

        <AvatarBox onClick={() => this.props.onChangeTab('account')}>
          <Avatar src={this.props.user.avatar.s100} />
        </AvatarBox>

      </Panel>
    )
  }
}

export default Navbar
