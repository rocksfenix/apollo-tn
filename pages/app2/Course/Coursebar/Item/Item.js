import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Router from 'next/router'
import warna from 'warna'
import getTechIcon from '../../../getTechIcon'
import Advance from './Advance'

const Itembox = styled.li`
  width: 100%;
  min-height: 50px;
  list-style: none;
  display: flex; 
  justify-content: space-between;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    padding-left: 55px;
  }
`

const Text = styled.span`
  width: 220px;
  font-size: 14px;
  color: ${p => p.colorMode === 'light' ? '#2d2f3f' : '#FFF'};
  opacity: ${props => props.isWatched ? '0.7' : '1'};
  font-weight: ${props => props.isHover ? 'bold' : 'normal'};
  display: ${p => p.hide ? 'none' : 'block'};
`

const LogoBox = styled.div`
  width: ${props => props.isHover ? '20px' : '0px'};
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  transition: width 200ms ease-out;
  will-change: width;
  position: relative;
`

const LogoGlow = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${p => p.color};
  position: absolute;
  opacity: ${p => p.isHover ? '.9' : '0'};
  filter: blur(16px);
`

const LogoImg = styled.img`
  width: 100%;
`

const RibbleAnimation = keyframes`
 to {
   opacity: 0;
   transform: scale(20);
 }
`

const Gradient = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: ${p => p.show ? p.color : 'transparent'};
  background: ${p => p.gradient};
  overflow: hidden;
  display: ${p => p.show ? 'block' : 'none'};
  z-index: -1;
`
const RippleBallBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: transparent;
  overflow: hidden;
  z-index: 100;
`

const RippleBall = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: ${p => p.color};
  border-radius: 50%;
  right: 50px;
  animation: ${RibbleAnimation} 1.3s linear;
  animation-fill-mode: forwards;
  display: ${p => p.show ? 'block' : 'none'};
  opacity: .5;
  z-index: 100;
`

export default class extends Component {
  state = { hover: false }
  onMouseEnter = () => {
    this.setState({ hover: true })
  }

  onMouseLeave = () => {
    this.setState({ hover: false })
  }

  pushLesson = () => {
    const { slug, course } = this.props
    this.props.onChangeLesson(slug)
    Router.push(
      `/app2?tab=curso&course=${course.slug}&lesson=${slug}`,
      `/app2/curso/${course.slug}/${slug}`
    )
  }

  render () {
    const { children, isWatched, next, tech, active, size, ripple, index, colorMode } = this.props
    const { hover } = this.state
    const { color } = this.props.course
    const colorLighten = warna.lighten(color, 0.85).hex

    const gradientLight = `linear-gradient(90deg, ${warna.lighten(color, 0.8).hex}, ${warna.lighten(color, 1).hex})`
    const gradientDark = `linear-gradient(90deg, ${warna.darken(color, 0.6).hex}, #232427)`
    const gradient = colorMode === 'light' ? gradientLight : gradientDark

    return (

      <Itembox
        color={colorLighten}
        active={active}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        size={size}
        onClick={this.pushLesson}
      >
        <Gradient show={active} gradient={gradient} />

        <RippleBallBox>
          <RippleBall show={index === ripple} color={color} />
        </RippleBallBox>

        <Advance
          colorMode={colorMode}
          color={color}
          isWatched={isWatched}
          hover={hover}
          active={active}
          next={next}
        />
        <LogoBox isHover={hover || active}>
          <LogoImg src={getTechIcon(tech)} />
          <LogoGlow color={color} isHover={hover || active} />
        </LogoBox>

        <Text
          colorMode={colorMode}
          isHover={hover}
          isWatched={isWatched}
          hide={this.props.size === 'small'}
        >
          { children }
        </Text>
      </Itembox>
    )
  }
}
