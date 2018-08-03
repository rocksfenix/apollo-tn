import React, {Component} from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import config from '../config'

const Panel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 100vh;
  z-index: 700;
  background-color: ${props => props.bg};
  color: #aaa;
  width: 55px;
  overflow: hidden;
  transition: width .09s ease-in-out, box-shadow .15s ease-in-out;
  border-right: 1px solid #e5e5e5;
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

const Tecninja = styled.div`
  position: relative;
  transition: all .4s ease-out;
  left: ${props => props.show ? '10px' : '30px'};
  height: 55px;
  display: flex;
  align-items: center;
  color: #FFF;
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

const Item = ({ href, children, icon, active, onClick, theme }) => {
  // const sp = href.split('/')
  // const _href = `/app?tab=${sp[2]}&course=${sp[3]}&l2=${sp[4]}&l3=${sp[4]}`
  //  href={_href} as={href}
  return (
    <div>
      <ItemBox
        active={active}
        onClick={onClick}
        activeColor={theme.icon.active}
        pasiveColor={theme.icon.pasive}
      >
        { active ? <Glow bg={theme.glow.bg} shadow={theme.glow.shadow} /> : null }
        <IconBox
          active={active}
          activeColor={theme.icon.active}
          pasiveColor={theme.icon.pasive}
        >
          <i className={'icon-' + icon} />
        </IconBox>
        <ItemText>{ children }</ItemText>
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
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        bg={this.props.theme.bar.bg}
      >
        <BrandItem onClick={() => this.props.onChangeTab('account')}>
          <IconBox>
            <Image
              src='/static/tecninja.io-logo.svg'
              alt='Logo de Tecninja.io'
            />
          </IconBox>

          <Tecninja show={this.state.show}>Tecninja.io</Tecninja>
        </BrandItem>
        {config.tabs.map((t, index) => (
          <Item
            {...this.props}
            icon={t.icon}
            key={t.icon}
            active={this.props.toolIndex === index}
            onClick={() => this.props.onChangeTab(index, t.label)}
          >
            {t.name}
          </Item>
        ))}
      </Panel>
    )
  }
}

export default Navbar
