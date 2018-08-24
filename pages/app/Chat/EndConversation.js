import React from 'react'
import styled, { keyframes } from 'styled-components'

const anim = keyframes`
  15% {
    opacity: 0;
    transform: scale(.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    z-index: 2147483639;
  }
`

const Button = styled.div`
  width: 85%;
  height: 50px;
  background-color: #6e4adb;
  border-radius: 3px;
  border: 0;
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Panel = styled.div`
  animation: .3s ease-out ${anim};
  display: flex;
  flex-direction: column;
  min-width: 0px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.2em 1em;
  overflow: hidden;
  border-radius: 10px;
  background: rgb(233, 238, 244);
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const ButtonLike = styled.button`
  border: 0;
  border-radius: 3px;
  background-color: #FFF;
  padding: .5em 1em;
  cursor: pointer;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1em 0;
`

export default (props) => (
  <Panel>
    <div>
      <div>Gracias por ser Ninja</div>
      <div>Que opinas del soporte?</div>
      <Buttons>
        <ButtonLike>Like</ButtonLike>
        <ButtonLike>Dislike</ButtonLike>
      </Buttons>
    </div>
    <Button onClick={props.newChat}>Chatear de Nuevo</Button>
  </Panel>
)
