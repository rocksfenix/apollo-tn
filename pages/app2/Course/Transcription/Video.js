import React, { Component } from 'react'
import styled, {keyframes} from 'styled-components'
import ReactSwipeEvents from 'react-swipe-events'

const Panel = styled.div`
  width: 100%;
  /* height: 100vh; */
  overflow: hidden;
  position: relative;
  
  top: 0;
  /* bottom: 0; */
  left: 0;
  right: 0;
`
const Iframe = styled.iframe`
  border: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const VideoBox = styled.div`
  background-color: #1d1a22;
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  height: auto;
`
const Push = styled.div`
  width: 100%;
  height: 70%;
  position: absolute;
  background-color: transparent;
  z-index:1;

  @media screen and (orientation: landscape) {
    /* background-color: orange; */
    height: 85%;
  }

  @media screen and (orientation: portrait) {
    /* background-color: purple; */
    height: 70%;
  }

`
export default ({ videoSource }) => {
  // debugger
  if (videoSource) {
    return (
      <Panel>
        <VideoBox>
          <Push />
          <Iframe src={videoSource} frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </VideoBox>
      </Panel>
    )
  }

  return <h1>LEVEL UPPPPPPPPPPPPPPPPPPPPPPPPPPP</h1>
}
