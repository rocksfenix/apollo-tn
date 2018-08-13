import React from 'react'
import styled from 'styled-components'
import _Headroom from 'react-headroom'
import MobileMenu from './Mobile'
import Desktop from './Desktop'
import WithUser from '../HOC/WithUser'

const Headroom = styled(_Headroom)`
  width: 100%;
  height: 55px;
`

const Box = styled.div`
  position: absolute;
  top: 0;
  height: 55px;
  background-color: #0e1013;
  width: 100%;
  z-index: 1000;
`

const Navegation = (props) => (
  <Box>
    <Headroom disable={props.disablePinning}>
      <Desktop {...props} />
      <MobileMenu {...props} />
    </Headroom>
  </Box>
)

export default WithUser(Navegation)
