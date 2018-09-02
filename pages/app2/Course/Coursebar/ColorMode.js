import React from 'react'
import styled from 'styled-components'

const ColorModeBox = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const ColorModeIcon = styled.i`
  color: #c5c5c5;
  position: absolute;
  transition: all .4s ease-out;
`

export default ({ onSetColorMode, colorMode }) => {
  const isLight = colorMode === 'light'
  const mooon = {
    transform: isLight ? 'translateY(-100%)' : 'translateY(0%)',
    opacity: isLight ? '0' : '1',
    willChange: 'transform, opacity'
  }

  const sun = {
    transform: isLight ? 'translateY(0%)' : 'translateY(100%)',
    opacity: isLight ? '1' : '0',
    willChange: 'transform, opacity'
  }

  return (
    <ColorModeBox onClick={() => onSetColorMode()}>
      <ColorModeIcon className='icon-moon' style={mooon} />
      <ColorModeIcon className='icon-sun' style={sun} />
    </ColorModeBox>
  )
}
