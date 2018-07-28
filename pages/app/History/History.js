import React from 'react'
import styled from 'styled-components'

const History = styled.div`
  width: 100%;
  height: ${p => p.height};
  background: #FFF;
  border-right: 1px solid #e5e5e5;
  display: flex;
  position: absolute;
  left: ${props => props.show ? '0px' : '-100%'}; 
  transition: all .3s ease-in-out;
  justify-content: center;
  align-items: center;
  z-index: 800;
`

const CoverPanel = styled.div`
  /* max-width: 225px; */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 55px;
`

const CoverImg = styled.img`
  width: 50%;
  max-width: 150px;
`

export default ({ show, height }) => {
  // Limpiar la logica de esta seccion solo
  // 3 Estados disponibles
  // * Full
  // * Medium - En reproduccion
  // * Small - en Toolbox show
  let h = '55px'
  let imgSize = '40px'

  if (height === 'medium') {
    h = '165px'
    imgSize = '100px'
  }

  if (height === 'big') {
    h = '100vh'
    imgSize = '40px'
  }

  return (
    <History show={show} height={h}>
      <CoverPanel>
        <CoverImg
          src='/static/Node-elemental - copia-medium.png'
          width={imgSize}
        />
      </CoverPanel>
    </History>
  )
}
