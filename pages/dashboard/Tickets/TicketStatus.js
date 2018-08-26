import React from 'react'
import styled from 'styled-components'

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${p => p.fontSize || '14px'};
`

const Button = styled.div`
  background: ${p => p.active ? 'linear-gradient(90deg,rgb(28, 36, 41),rgb(0, 0, 0))' : '#e5eaf0'};
  color: ${p => p.active ? '#FFF' : '#222'};
  padding: .2em 1em;
  border-radius: 2px;
  margin: 0 .5em;
  opacity: .8;
  transition: all .2s ease-out;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`
export default ({ status, onUpdateStatus, fontSize }) => (
  <Buttons fontSize={fontSize}>
    <Button active={status === 'new'} onClick={() => onUpdateStatus('new')}>New</Button>
    <Button active={status === 'working'} onClick={() => onUpdateStatus('working')}>Working</Button>
    <Button active={status === 'completed'} onClick={() => onUpdateStatus('completed')}>Completed</Button>
  </Buttons>
)
