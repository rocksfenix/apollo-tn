import React from 'react'
import styled from 'styled-components'

const Box = styled.span`
  width: 200px;
  font-size: 18px;
  color: #cccccc;
  cursor: pointer;
  transition: all .3s ease-out;
  font-weight: bold;
  letter-spacing: 1px;

  &:hover {
    opacity: .5;
  }
`

const Image = styled.img`
  width: 45px;
  margin-right: .5em;
`

export default (props) => (
  <Box {...props}>
    <Image
      src='/static/tecninja.io-logo.svg'
      alt='Logo de Tecninja.io'
    />
    Tecninja.io
  </Box>
)
