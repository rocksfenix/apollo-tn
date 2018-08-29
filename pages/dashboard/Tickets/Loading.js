import React from 'react'
import styled from 'styled-components'
import { Ripple } from '../../../components/Spinners'

const Panel = styled.div`
  position: absolute;
  width: 100%;
  background-color: rgba(255,255,255,.6);
  top: 100px;
  right: 0;
  bottom: 100px;
  left: 0;
  z-index: 10;
  display: ${p => p.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
`

export default (props) => (
  <Panel {...props}>
    <Ripple show />
  </Panel>
)
