import React from 'react'
import styled, {keyframes} from 'styled-components'

const gostColorLight = 'rgba(0, 0, 0, 0.2)'
const gostColorDark = 'rgba(255, 255, 255, 0.2)'

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
  font-size: 8px;
  position: relative;
  top: 2px;
`

const BallWatchedIconPlay = styled.i`
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
  background-color: ${p => p.colorMode === 'light' ? '#FFF' : '#232427'};
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

const BallPlay = ({ color, colorMode }) => (
  <BallPlayBox color={color} colorMode={colorMode}>
    <BallPlayIcon className='icon-play' color={color} />
  </BallPlayBox>
)

const BallPlaying = ({ isWatched, color }) => (
  <BallWatchedBox isWatched={isWatched} color={color}>
    <BallWatchedIconPlay className='icon-play' />
  </BallWatchedBox>
)

export default ({ colorMode, color, isWatched, hover, active }) => {
  let Ball = <BallInactive colorMode={colorMode} />
  if (isWatched) Ball = <BallWatched color={color} isWatched={isWatched} />
  if (hover && !isWatched) Ball = <BallPlay color={color} colorMode={colorMode} />
  if (active) Ball = <BallPlaying color={color} />

  return Ball
}
