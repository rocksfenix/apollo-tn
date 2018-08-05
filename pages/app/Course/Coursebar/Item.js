import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Link from 'next/link'
import warna from 'warna'
import getTechIcon from '../../getTechIcon'

const gostColor = 'rgba(0, 0, 0, 0.2)'

const Itembox = styled.li`
  width: ${p => p.size === 'big' ? '100%' : '25px'};
  min-height: 50px;
  list-style: none;
  display: flex; 
  justify-content: space-between;
  align-items: center;
  transition: background .3s ease-out;
  position: relative;
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
  font-size: 12px;
  color: #2d2f3f;
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
    return gostColor
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
  border: 2px solid ${gostColor};
  background-color: #FFF;
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
  font-size: 8px;
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
`
const BallPlay = ({ color }) => (
  <BallPlayBox color={color}>
    <BallPlayIcon className='icon-play-1' color={color} />
  </BallPlayBox>
)

const BallPlaying = ({ isWatched, color }) => (
  <BallWatchedBox isWatched={isWatched} color={color}>
    <BallWatchedIcon className='icon-play-1' />
  </BallWatchedBox>
)

const LogoBox = styled.div`
  width: ${props => props.isHover ? '20px' : '0px'};
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  transition: all .15s ease-out;
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

  render () {
    const { children, isWatched, next, tech, slug, course, active, size, ripple, index } = this.props
    const { hover } = this.state
    const { color } = this.props.course
    const colorLighten = warna.lighten(color, 0.85).hex
    const gradient = `linear-gradient(90deg, ${warna.lighten(color, 0.8).hex}, ${warna.lighten(color, 1).hex})`
    // Ball
    let Ball = <BallInactive />
    if (isWatched) Ball = <BallWatched color={color} isWatched={isWatched} />
    if (hover && !isWatched) Ball = <BallPlay color={color} />
    if (active) Ball = <BallPlaying color={color} />

    return (
      <Link
        href={`/app?tab=curso&course=${course.slug}&lesson=${slug}`}
        as={`/app/curso/${course.slug}/${slug}`}
      >
        <Itembox
          color={colorLighten}
          active={active}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          size={size}
          onClick={() => this.props.onChangeLesson(slug)}
        >
          <Gradient show={active} gradient={gradient} />
          <RippleBallBox>
            <RippleBall show={index === ripple} color={color} />
          </RippleBallBox>
          <Advance>
            <BallBox>
              { Ball }
              <Line
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
            isHover={hover}
            isWatched={isWatched}
            hide={this.props.size === 'small'}
          >
            { children }
          </Text>
        </Itembox>
      </Link>
    )
  }
}
