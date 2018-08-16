import React from 'react'
import styled from 'styled-components'

const Icon = styled.span`
  margin: ${props => props.margin || '0 1em'};
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
