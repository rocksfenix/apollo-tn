import React from 'react'
import styled, {keyframes} from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Pop = keyframes`
  0% {
    opacity: 0;
    top: 150px;
  }

  50% {
    opacity: 1
  }

  100% {
    opacity: 0;
    top: -2px;
  }

`

const Text = styled.div`
  position: absolute;
  left: 1.3em;
  top: 300px;
  font-size: 60px;
  z-index: 1000;
  color: rgba(68, 85, 132, 0.5);
  animation: 2s ease-out ${Pop};
  animation-fill-mode: forwards;
`

export default ({ text }) => (
  <TransitionGroup>
    <CSSTransition
      timeout={2000} key={text}
      classNames='defaultCSSTransition'
    >
      <Text>{ text }</Text>
    </CSSTransition>
  </TransitionGroup>
)
