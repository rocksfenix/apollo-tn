import React from 'react'
import styled from 'styled-components'

const Priority = styled.span`
  background: ${props => {
    if (props.priority === 'low') { return 'gray' }
    if (props.priority === 'normal') { return '#00adff' }
    if (props.priority === 'urgent') { return 'red' }
  }};
  border-radius: 25px;
  color: #FFF;
  font-size: 12px;
  padding: .2em .5em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
`
export default ({ priority }) => (
  <Priority priority={priority}>
    { priority }
  </Priority>
)
