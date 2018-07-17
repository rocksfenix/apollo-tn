import React from 'react'
import styled from 'styled-components'
import { Ellipsis } from './Spinners'

const FetchingBox = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`

export default ({ show }) => (
  <FetchingBox show={show}>
    <Ellipsis />
  </FetchingBox>
)
