import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import NoteEditor from './NoteEditor'

const Anima = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    left: translateX(0%);
  }
`

// width: 100%;
// height: 100%;
const Panel = styled.div`
  transition: left .2s;
  will-change: transform;
  animation: ${Anima} .2s ease-out;
  position: relative;
  background-color: red;
  flex-flow: 1;
  overflow-y: auto;
`

const MainPanel = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 55px;
  padding-top: 55px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(0,0,0,0.9);
`

const Bar = styled.div`
  width: 100%;
  height: 55px;
  background-color: blue;
  flex-shrink: 0;
`

const Item = styled.div`
  width: 100%;
  height: 100px;
  background-color: #1b1b1d;
  color: #a0a0a0;
`

export default class extends Component {
  render () {
    if (this.props.tab !== 'notes') return null
    return (
      <MainPanel id='ScrollableNotes'>
        <Bar>*</Bar>
        <Panel>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
          <Item>Ejemplo de una simple y mundana nota.</Item>
        </Panel>
        <NoteEditor />
      </MainPanel>
    )
  }
}
