import React from 'react'
import styled from 'styled-components'

const Spin = styled.img`
  display: ${p => p.show ? 'block' : 'none'};
  margin: 1em auto;
  width: {p => p.width || '100%'};
`

export const Ellipsis = (props) => <Spin src='/static/ellipsis.svg' {...props} />

export const Ripple = (props) => <Spin src='/static/ripple.svg' {...props} />
