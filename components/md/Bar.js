import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Notify from './Notify'

const Bar = styled.div`
  width: 100%;
  height: 40px;
  background: #111218;
  border-radius: 5px 5px 0 0;
  padding: 0 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
  margin-top: 3em;
  margin-left: auto;
  margin-right: auto;
  font-size: 15px;
  color: #706d75;
  position: relative;

  @media (max-width: 768px) {
    width: 95%
  }
`

const BallsPanel = styled.div`
  width: 65px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const Ball = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color || '#272931'};
  border-radius: 50%;
`
const Icon = styled.img`
  height: 20px;
  margin-right: 0.5em;
`

const Balls = ({ colors = [] }) => (
  <BallsPanel>
    <Ball color={colors[0]} />
    <Ball color={colors[1]} />
    <Ball color={colors[2]} />
  </BallsPanel>
)

const Buttons = styled.div`
  width: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const IconBtn = styled.i`
  color: gray;
  color: #4d475b;
`

const Button = styled.button`
  border: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: gray; */
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  /* margin-right: 3em; */
  /* background-color: red; */
  cursor: pointer;
  &:hover > i {
    color: #5856c0;
    color: #00b6ff;
  }
`

const Anima = keyframes`
  0% {
    top: 0;
    opacity: .2;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: -70px;
    opacity: 0;
  }
`

const SusBox = styled.div`
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: 1.5s ease-out ${Anima};
  animation-fill-mode: forwards;
`

const SusIcon = styled.i`
  color: red;
`
const Suspended = () => (
  <SusBox>
    <SusIcon className='icon-heart-1' /> Agregado a Snippets
  </SusBox>
)

export default class extends Component {
  state = { }
  onCopy = () => {
    const { language, literal, code } = this.props
    console.log('COPY')
    this.setState({ action: 'copy' })
    // window.setTimeout(() => {
    //   this.setState({ action: null })
    // }, 50)
    this.props.onCopy({language, text: literal || code})
  }

  onFavorite = () => {
    const { language, literal, code } = this.props
    console.log('COPY')
    this.setState({ action: 'Fue agregado a Favoritos' })
    window.setTimeout(() => {
      this.setState({ action: null })
    }, 1200)
    this.props.onCopy({language, text: literal || code})
  }

  onDownload = () => {
    const { language, literal, code } = this.props
    console.log('COPY')
    this.setState({ action: 'Download' })
    // window.setTimeout(() => {
    //   this.setState({ action: null })
    // }, 50)
    this.props.onCopy({language, text: literal || code})
  }
  render () {
    const { colors = [], title = '', onCopy, language, literal, code, icon } = this.props
    return (
      <Bar>
        <Balls colors={colors} />
        <div>
          { icon ? <Icon src='/static/react.svg' /> : ''}
          { title }
        </div>
        <Notify text={this.state.action} />
        <Buttons>
          <Button onClick={this.onFavorite}>
            {/* <Suspended /> */}
            <IconBtn className='icon-favorite-line' />
          </Button>
          <Button onClick={this.onCopy}>
            <IconBtn className='icon-copy' />
          </Button>
          <Button onClick={this.onDownload}>
            <IconBtn className='icon-download' />
          </Button>
        </Buttons>
      </Bar>
    )
  }
}
