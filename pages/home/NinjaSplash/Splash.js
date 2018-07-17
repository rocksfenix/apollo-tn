import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import Particles from './Particles'
import NinjaSVG from './Ninja'

const Height100 = styled.div`
  height: 100%;
  position: relative;
  z-index: 10;
`

const Type = styled.div`
  color: #FFF;
  font-family: Lato;
  font-size: 50px;
  font-weight: bold;
`

const Subtitle = styled.h2`
  color: #fff;
  font-family: Lato;
  font-family: Roboto;
  font-size: 25px;
  font-weight: 100;
  line-height: 1.5;
  font-size: 19px;
  position: relative;
  z-index: 10;
  font-weight: ${props => props.weight || 100};

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`

const SubtitleStrong = styled.strong`
  font-family: 'Roboto';
  font-size: 22px;
  font-weight: bold;
  font-style: italic;
`

const Panel = styled.header`
  width: 100%;
  height: ${props => props.height || '100vh'};
  overflow-x: hidden;
  position: relative;
  color: #000; /* Ninja SVG */
  font-family: Lato;
  font-size: 30px;
  overflow: hidden;
  z-index: -1;
  background: yellow;

  @media (max-width: 768px) {
    height: 100vh;
  }
`

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.color || '#FFF'};
  position: absolute;
  top: 0;
  z-index: 1;
  transition: all 1.2s ease-out;
`

const Gradient = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(rgba(0, 0, 0, 0.45),#000000);
  position: absolute;
  top: 0;
  z-index: 2;
`

const GradientShadow = styled.div`
  position: absolute;
  width: 100%;
  height: 50%;
  z-index: 2;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  background: linear-gradient(rgba(0,0,0,0),rgba(0, 0, 0, 0.55),rgba(0, 0, 0, 1));

  @media (max-width: 900px) {
    background: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.55),rgba(0, 0, 0, 0.33));
    opacity: .2;
  }
`

const Title = styled.h1`
  padding-top: 1.5em;
  color: #fff;
  font-family: Roboto;
  font-weight: bold;
  text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
  font-size: 35px;

  @media (max-width: 1024px) {
    padding-top: 0;
  }
`

const NinjaBox = styled.div`
  width: 100%;
  position: absolute;
  transform: scale(1.6) translateX(13%) translateY(5%);
  height: 100%;
  height: 100vh;
  z-index: 5;

  @media (max-width: 1100px) {
    transform: scale(1) translateX(25%) translateY(-5%);
    transform: scale(1.9) translateX(20%) translateY(0%);
  }

  @media (max-width: 768px) {
    transform: scale(1.4) translateX(11%) translateY(27%);
    transform: scale(2) translateX(11%) translateY(25%);
  }
`

const Splash = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  overflow: hidden;
  background: blue;
`

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  z-index: 4;
`

const CursorAnima = keyframes`
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
  animation: ${CursorAnima} 2s ease-in-out infinite;
`

const LeyendBox = styled.div`
  max-width: 50%;
  padding: 1em;

  @media (max-width: 1024px) {
    /* min-width: 620px; */
    max-width: 60%;
  }

  @media (max-width: 900px) {
    padding-top: 2em;
    max-width: 100%;
  }
`

function getRandomInt (min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

class Typing extends Component {
  state = {
    text: '',
    pos: 0
  }
  componentDidMount () {
    this.typing()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.text !== this.props.text) {
      // inicializar el typing
      this.state.text = ''
      this.forceUpdate()
      window.setTimeout(() => {
        this.typing()
      }, 500)
      // console.log('CHANGE NOW')
    }
  }

  typing = () => {
    if (!this.tick) {
      this.tick = window.setInterval(() => {
        if (this.state.pos < this.props.text.length) {
          this.state.text += this.props.text[this.state.pos]
          this.state.pos = this.state.pos + 1
          this.forceUpdate()
        } else {
          // limpiar
          window.clearInterval(this.tick)
          this.tick = undefined
          this.state.pos = 0
        }
      }, 50)
    }
  }

  render () {
    return (
      <Type>
        { this.state.text} <Cursor>|</Cursor>
      </Type>
    )
  }
}

class SplashComponent extends Component {
  static defaultProps = {
    data: [
      {
        text: 'Chrome Devtools',
        logo: '/static/chrome-devtools.png',
        bgColor: '#c96a49',
        linesColor: 'yellow'
      },
      {
        text: 'React.js',
        logo: '/static/react.svg',
        bgColor: '#00a1ff',
        linesColor: '#03A9F4'
      },
      {
        text: 'Javascript',
        logo: '/static/javascript.png',
        bgColor: '#d5d000',
        linesColor: 'yellow'
      },
      {
        text: 'Webpack 5+',
        logo: '/static/webpack.svg',
        bgColor: '#4c4bd3',
        linesColor: '#0586ff'
      },
      {
        text: 'Vue.js',
        logo: '/static/vue.svg',
        bgColor: '#00ff8c',
        linesColor: 'Green'
      },
      {
        text: 'Node',
        logo: '/static/node.png',
        bgColor: '#4cd65b',
        linesColor: '#11d69c'
      },
      {
        text: 'Angular',
        logo: '/static/angular.svg',
        bgColor: '#d20f0f',
        linesColor: '#ee0c0e'
      },
      {
        text: 'RXJS',
        logo: '/static/rxjs.png',
        bgColor: '#4a50d2',
        linesColor: '#9600ff'
      },
      {
        text: 'Ember.js',
        logo: '/static/ember.svg',
        bgColor: '#E46651',
        linesColor: 'orange'
      }
    ]
  }

  state = { active: 0 }

  componentWillMount () {
    this.setState({ active: getRandomInt(0, this.props.data.length) })
  }

  componentDidMount () {
    const canvas = document.getElementById('canvas')
    // debugger

    this.setState({ height: window.innerHeight })
    const particles = new Particles(canvas, { // eslint-disable-line
      size: {
        min: 0,
        max: 6
      },
      density: 350,
      speed: 1,
      fps: 30,
      color: 'rgba(0,0,0,.5)'
    })

    const totalTime = 3500

    setInterval(() => {
      if (this.state.active === this.props.data.length - 1) {
        this.setState({ active: 0 })
      } else {
        this.setState({ active: this.state.active + 1 })
      }
    }, totalTime)
  }

  render () {
    const active = this.props.data[this.state.active]
    return (
      <Panel>
        <Height100>
          <LeyendBox>
            <Title>Porque Ninja?</Title>
            <Subtitle>
              Los Ninjas utilizaban tácticas de guerra poco habituales pero altamente efectivas,
              eran rápidos, agresivos y precisos, eso es justamente lo que representamos
              <SubtitleStrong> lecciones rápidas, efectivas y concretas </SubtitleStrong>
              sobre las ultimas herramientas del Desarrollo Web Fullstack.
            </Subtitle>
            <Typing text={active.text} />
          </LeyendBox>
        </Height100>
        <Gradient />
        <Background color={active.bgColor} />
        <GradientShadow />
        <Canvas id='canvas' width='1327' height='667' />
        <Splash>
          <NinjaBox>
            <NinjaSVG config={active} />
          </NinjaBox>
        </Splash>
      </Panel>
    )
  }
}

export default SplashComponent
