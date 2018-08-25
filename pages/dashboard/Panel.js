import styled from 'styled-components'

export default styled.div`
  width: 100%;
  height: 100vh;
  background-color: yellow;
  background: #fbfbfb;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  will-change: opacity, transform;
  transition: all .5s ease-out;
  top: 0;
  z-index: ${p => p.show ? '1000' : '-1'};
  transform: ${p => p.show ? 'scale(1)' : 'scale(.97)'};
`
