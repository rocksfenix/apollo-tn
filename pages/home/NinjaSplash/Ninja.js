import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import getNinja from './getNinjaSVG'

const anima = keyframes`
  0% {
    opacity: .1;
  }
  50% {
    opacity: .6;
  }
  100% {
    opacity: .1;
  }
`

const Box = styled.div`
  width: 100vw;
  height: 100vh;
  position: realtive;
`

const Light = styled.div`
  width: 8%;
  height: 14%;
  background: ${props => props.color || '#FFF'};
  opacity: .2;
  filter: blur(20px);
  position: absolute;
  top: 250px;
  left: 45%;
  z-index: 5;
  
  border-radius: 15%;
  transition: all 1s ease-out;
  animation: 3s linear ${anima} infinite;

  @media (max-width:768px) {
    top: 265px;
  }
`

const Logo = styled.div`
  width: 5%;
  background: rgba(0,0,0,0.8);
  position: absolute;
  top: 250px;
  left: 47%;
  border-radius: 50%;
  opacity: .5;
  z-index: 2;
  

  @media (max-width:768px) {
    top: 265px;
  }
`

const Image = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
`

class NinjaSvg extends Component {
  top = null
  bottom = null

  componentWillMount () {
    this.path = getNinja(this.props.config.linesColor)
  }

  componentDidMount () {
    const { linesColor } = this.props.config
    const top = document.getElementById('Ninja-light-top')
    const bottom = document.getElementById('Ninja-light-bottom')
    top.children[0].setAttribute('fill', linesColor)
    top.children[1].setAttribute('fill', linesColor)
    bottom.children[0].setAttribute('fill', linesColor)
    bottom.children[1].setAttribute('fill', linesColor)

    this.top = top
    this.bottom = bottom
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.config.text !== this.props.config.text
    ) {
      const { linesColor } = nextProps.config
      this.top.children[0].setAttribute('fill', linesColor)
      this.top.children[1].setAttribute('fill', linesColor)
      this.bottom.children[0].setAttribute('fill', linesColor)
      this.bottom.children[1].setAttribute('fill', linesColor)
    }
  }

  render () {
    const { linesColor, logo, text } = this.props.config
    return (
      <Box >
        <Box dangerouslySetInnerHTML={{ __html: this.path }} />
        <Logo>
          <TransitionGroup>
            <CSSTransition
              timeout={2000} key={text}
              classNames='slideUpNinja'
            >
              <Image src={logo} />
            </CSSTransition>
          </TransitionGroup>
        </Logo>
        <Light color={linesColor} />
      </Box>
    )
  }
}

export default NinjaSvg
