import React from 'react'
import styled from 'styled-components'

const ColorModeBox = styled.div`
  width: 150px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const ColorModeIcon = styled.i`
  color: #c5c5c5;
  position: absolute;
  transition: all 150ms ease-out;
  right: 0;
  font-size: 30px;
  /* transition: all .4s cubic-bezier(1,0,0,1); */
`

const TextBox = styled.div`
  color: #c5c5c5;
  position: absolute;
  transition: all 150ms ease-out;
  font-size: 14px;
`

export default ({ onSetAutoplay, autoplay }) => {
  const off = {
    transform: autoplay ? 'translateX(-100%)' : 'translateX(0%)',
    opacity: autoplay ? '0' : '1'
  }

  const on = {
    transform: autoplay ? 'translateX(0%)' : 'translateX(100%)',
    opacity: autoplay ? '1' : '0'
  }

  return (
    <ColorModeBox onClick={() => onSetAutoplay()}>
      <TextBox>Auto Play</TextBox>
      <ColorModeIcon className='icon-off' style={off} />
      <ColorModeIcon className='icon-on' style={on} />
    </ColorModeBox>
  )
}
