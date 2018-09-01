import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Router from 'next/router'
import warna from 'warna'
import getTechIcon from '../../getTechIcon'

const gostColorLight = 'rgba(0, 0, 0, 0.2)'
const gostColorDark = 'rgba(255, 255, 255, 0.2)'

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

const Advance = styled.span`
  width: 25px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Text = styled.span`
  width: 220px;
  font-size: 14px;
  color: ${p => p.colorMode === 'light' ? '#2d2f3f' : '#FFF'};
  opacity: ${props => props.isWatched ? '0.7' : '1'};
  font-weight: ${props => props.isHover ? 'bold' : 'normal'};
  display: ${p => p.hide ? 'none' : 'block'};
`

const BallBox = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Line = styled.div`
  width: 50%;
  height: 50px;
  top: 50%;
  width: 2px;
  background: ${props => {
    if (props.isPartial && props.isWatched) {
      return `linear-gradient(${props.color}, white);`
    }
    if (props.isWatched) {
      return props.color
    }
    return props.colorMode === 'light' ? gostColorLight : gostColorDark
  }};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

`
const BallInactive = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: relative;
  z-index: 500;
  border: 2px solid ${p => p.colorMode === 'light' ? gostColorLight : gostColorDark};
  background-color: ${p => p.colorMode === 'light' ? '#FFF' : '#232427'};
`

const BallWatchedBox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.isPartial) {
      return `linear-gradient(${props.color}, white);`
    }
    return props.color
  }};
  position: relative;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BallWatchedIcon = styled.i`
  color: #FFF;
  font-size: 6px;
  position: relative;
  left: 1px;
`

const BallWatched = ({ isWatched, color }) => (
  <BallWatchedBox isWatched={isWatched} color={color}>
    <BallWatchedIcon className='icon-success' />
  </BallWatchedBox>
)

const Ani = keyframes`
  0% {
    transform: scale(.2)
  }
  10% {
    transform: scale(1)
  }
`

const BallPlayBox = styled.div`
  width: 16px;
  height: 16px;
  background: #FFF;
  border: ${props => `solid 2px ${props.color}`};
  border-radius: 50%;
  position: relative;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: .8s ease-out ${Ani};
  animation-fill-mode: forwards;
`

const BallPlayIcon = styled.i`
  color:${props => props.color};
  font-size: 6px;
  position: relative;
  left: 1px;
`
const BallPlay = ({ color }) => (
  <BallPlayBox color={color}>
    <BallPlayIcon className='icon-play' color={color} />
  </BallPlayBox>
)

const BallPlaying = ({ isWatched, color }) => (
  <BallWatchedBox isWatched={isWatched} color={color}>
    <BallWatchedIcon className='icon-play' />
  </BallWatchedBox>
)

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
    // Ball
    let Ball = <BallInactive colorMode={colorMode} />
    if (isWatched) Ball = <BallWatched color={color} isWatched={isWatched} />
    if (hover && !isWatched) Ball = <BallPlay color={color} />
    if (active) Ball = <BallPlaying color={color} />

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
        <Advance>
          <BallBox>
            { Ball }
            <Line
              colorMode={colorMode}
              isWatched={isWatched}
              isPartial={!next.isWatched}
              color={color}
            />
          </BallBox>
        </Advance>
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
