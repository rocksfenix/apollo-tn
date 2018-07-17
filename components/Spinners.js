import React from 'react'
import styled from 'styled-components'

const Spin = styled.img`
  display: block;
  margin: 1em auto;
`

export const Ellipsis = () => <Spin src='/static/ellipsis.svg' />

export const Ripple = () => <Spin src='/static/ripple.svg' />
