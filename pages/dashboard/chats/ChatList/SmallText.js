import React from 'react'
import styled from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Text = styled.div`
  position: absolute;
  width: 100%;
  font-size: 11px;
`

export default ({ text }) => (
  <TransitionGroup>
    <CSSTransition
      timeout={500} key={text}
      classNames='chatPreviewText'
    >
      <Text>{ text }</Text>
    </CSSTransition>
  </TransitionGroup>
)
