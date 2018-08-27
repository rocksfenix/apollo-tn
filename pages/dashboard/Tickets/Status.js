import React from 'react'
import styled from 'styled-components'

const TicketStatus = styled.span`
  background-color: ${p => {
    if (p.status === 'new') return '#df1b1b'
    if (p.status === 'working') return '#00b6ff'
    if (p.status === 'completed') return '#1bdf60'
  }};
  color: #FFF;
  font-size: 12px;
  padding: .2em .9em;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default ({ status }) => (
  <TicketStatus status={status}>
    { status }
  </TicketStatus>
)
