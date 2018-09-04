import styled, {keyframes} from 'styled-components'

const Show = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 0%;
  }
`

export default styled.div`
  width: 100%;
  height: 100%;
  background-color: #0b0d15;
  animation: .25s ease-out ${Show};
  animation-fill-mode: forwards;
  position: absolute;
  z-index: 700;
  padding-top: 55px;
  display: ${p => p.show ? 'block' : 'none'};
`
