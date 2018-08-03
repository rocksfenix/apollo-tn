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
  width: 280px;
  height: 100%;
  background-color: #0b0d15;
  animation: .25s ease-out ${Show};
  animation-fill-mode: forwards;
  position: absolute;
  top: 0;
  left: 0%;
  z-index: 700;
  /* box-shadow: 0 0 97px 10px rgba(0,0,0,0.6); */
  /* padding-top: 55px; */
  margin-top: 55px;
`
