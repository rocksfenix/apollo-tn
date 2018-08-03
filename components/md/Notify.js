import React from 'react'
import styled, {keyframes} from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Pop = keyframes`
  0% {
    opacity: 0;
    top: 0px;
  }

  50% {
    opacity: 1
  }

  100% {
    opacity: 0;
    top: -100px;
  }

`

const Text = styled.div`
  position: absolute;
  right: 1.3em;
  top: 0;
  font-size: 20px;
  z-index: 1000;
  background-color: purple;
  border-radius: 3px;
  padding: .1em .2em;
  color: #FFF;
  /* color: rgba(68, 85, 132, 0.5); */
  animation: 1.6s ease-out ${Pop};
  animation-fill-mode: forwards;
`

export default ({ text }) => (
  <TransitionGroup>
    <CSSTransition
      timeout={1000} key={text}
      classNames='defaultCSSTransition'
    >
      <div>
        { text ? <Text>{ text }</Text> : null }
      </div>
    </CSSTransition>
  </TransitionGroup>
)
