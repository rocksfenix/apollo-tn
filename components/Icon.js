import React from 'react'
import styled from 'styled-components'

const Icon = styled.i`
  margin: ${props => props.margin || '0 3px'};
  color: ${props => props.color || ''};
  font-size: ${props => props.size || '18px'};
`

const IconComponent = (props) => (
  <Icon
    {...props}
    className={`icon-${props.type}`}
  />
)
export default IconComponent
