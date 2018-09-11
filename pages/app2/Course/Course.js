import React, {Component} from 'react'
import styled from 'styled-components'
import Transcription from './Transcription'
import Coursebar from './Coursebar'

const Panel = styled.section`
  width: 100%;
  height: 100vh;
  padding-left: 55px;
  overflow-x: hidden;
  display: flex;
  background-color: #FFF;

  @media (max-width:900px) {
    padding-left: 0;
  }
`
//  onMouseUp={props.hideSidebar}
export default (props) => (
  <Panel>
    <Coursebar
      {...props}
    />
    <Transcription
      {...props}
    />
  </Panel>
)
