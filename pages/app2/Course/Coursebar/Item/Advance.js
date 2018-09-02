import React from 'react'
import styled from 'styled-components'
import Ball from './Ball'

const gostColorLight = 'rgba(0, 0, 0, 0.2)'
const gostColorDark = 'rgba(255, 255, 255, 0.2)'

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
      return `linear-gradient(${props.color}, white)`
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
const Advance = styled.span`
  width: 25px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export default ({ colorMode, color, isWatched, hover, active, next }) => (
  <Advance>
    <BallBox>
      <Ball colorMode={colorMode} color={color} isWatched={isWatched} hover={hover} active={active} />
      <Line
        colorMode={colorMode}
        isWatched={isWatched}
        isPartial={!next.isWatched}
        color={color}
      />
    </BallBox>
  </Advance>
)
