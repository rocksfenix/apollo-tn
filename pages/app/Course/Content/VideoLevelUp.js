import React, { Component } from 'react'
import styled, {keyframes} from 'styled-components'
import Icon from '../../../../components/Icon'
import Link from 'next/link'

const Screenshot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  background: url(${props => props.src});
  background-size: cover;
  filter: blur(1px);
`

const Box = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  position: absolute;
  animation: ${props => props.animate ? `.6s ease-out ${Anima}` : ''};
`

const Button = styled.div`
  padding: ;
  cursor: pointer;
  opacity: 1;
  border: none;
  background-color: #0273D4;
  padding: 1.3em 3em;
  border-radius: 9px;
  transition: all 0.25s;

  &:hover {
    box-shadow: 1px  3px 30px rgba(0,0,0,0.5);
    opacity: .8;
  }
`

const UpWraper = styled.div`
  width: 100%;
  height: 80vh;
  overflow: hidden;
  position: relative;
  top: 0;
  /* bottom: 0; */
  left: 0;
  right: 0;
`

const Shadow = styled.div`
  background: radial-gradient(rgba(0,0,0,0.8), #000);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  color: #FFF;
`

const Anima = keyframes`
  from{
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const ProTitle = styled.div`
  text-align: center;
  font-size: ${props => props.size || '30px'};
  width: 70%;
  margin: 0 auto 0 auto;
  font-weight: bold;

  @media (max-width: 900px) {
    font-size: 25px;
    width: 90%;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const ProBig = styled.div`
  text-align: center;
  font-size: 40px;
  width: 100%;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`

const ProSubtitle = styled.div`
  text-align: center;
  font-size: 18px;
  width: 70%;
  margin: 0 auto;
  color: #686868;

  @media (max-width: 900px) {
    width: 90%;
  }
`

const GetPro = styled.a`
  font-family: Roboto;
  border-radius:50px;
  border: 0px solid transparent;
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
  padding: 8px 30px;
  background: linear-gradient(to right,#a5ce1c 0%,#51a504 100%);
  background: linear-gradient(to right,#15c4e8 0%,#11cbba 100%);
  color: #FFF;
  margin: 1em auto;
  margin: 1em auto;
  display: block;
  width: 230px;
  transition: all .2s ease-out;

  &:hover {
    opacity: 0.8;
  }
`

const TextPro = styled.div`
  width: 100%;
  margin-top: 4em;
  @media (max-width: 900px) {
    margin-top: 1em;
  }
`

const ProContent = ({show}) => (
  <Box show={show} animate>
    <Shadow>
      <TextPro>
        <ProTitle>
          Leccion disponible para susciptores
          <ProBig>
            Ninja PRO
          </ProBig>
        </ProTitle>
        <ProSubtitle>
          Desbloquea ya mismo todo el contenido PRO, series, lecciones y mas
        </ProSubtitle>
        <Link href='/pro'>
          <GetPro><Icon type='thunder-1' color='#FFF' margin='0' />Obten Ninja PRO</GetPro>
        </Link>
      </TextPro>
    </Shadow>
  </Box>
)

const Play = ({show, onClick}) => (
  <Box show={show} onClick={onClick}>
    <Button>
      <Icon type='play-1' margin='0' size='50px' color='#FFF' />
    </Button>
  </Box>
)

export default class extends Component {
  state = {showBenefits: false}

  play = () => {
    this.setState({showBenefits: true})
  }

  render () {
    return (
      <UpWraper>
        <Screenshot src={`https://dxpdcvj89hnue.cloudfront.net/images/screenshot-default-lesson.png`} />
        {/* <ProContent show={true} /> */}
        <Play show onClick={this.play} />
      </UpWraper>
    )
  }
}
