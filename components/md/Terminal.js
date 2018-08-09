import React from 'react'
import styled, {keyframes} from 'styled-components'
import Bar from './Bar'

const Anima = keyframes`
    0% {
        opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
        opacity: 1;
    }
`

const Cursor = styled.span`
  color: #009fff;
  animation: 1.5s ease-in-out ${Anima} infinite;

  &:after {
    content: '█'
  }
`
const Command = styled.span`
  color: #009fff;
  font-size: 21px;
  margin-right: 0.5em;
  &:after {
    content: '~'
  }
`

const Terminal = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #1d1f27;
  background: #0d0e14;
  min-height: 100px;
  color: #FFF;
  letter-spacing: 1px;
  word-spacing: 2px;
  margin-bottom: 2em;
  padding: 1.5em;
  font-weight: 100;
  width: 95%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    width: 95%
  }
`

export default (props) => (
  <div>
    <Bar
      colors={[ '#580d21', '#56470e', '#083b13' ]}
      title='Terminal ~'
      {...props} />
    <Terminal>
      <Command />
      { props.literal }
      <Cursor />
    </Terminal>
  </div>
)
