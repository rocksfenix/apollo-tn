import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled, {keyframes} from 'styled-components'
import { Ellipsis } from '../../../components/Spinners'
import DetailsItem from './DetailsItem'
import CoverFade from './CoverFade'

const desktopShow = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300px);
}
`

const mobileShow = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
}
`

const mobileHide = keyframes`
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
}
`
// Definimos un translateX dependiendo de si es
// mobile o desktop, despues si es show
// se agregan las animaciones para mostrar
const Panel = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #FFF;
  position: absolute;
  top: 0;
  will-change: transform;
  overflow: auto;
  transform: ${p => p.isMobile ? 'translateX(100%)' : 'translateX(-100%)'};
  bottom: 55px;
  z-index: ${p => p.isMobile ? '1000' : '-1'};
  animation: ${p => {
    if (p.show) {
      if (p.isMobile) return mobileShow
      return desktopShow
    } else {
      if (p.isMobile) return mobileHide
    }
  }};
  animation-duration: 200ms;
  animation-fill-mode: forwards;
  transition: transform .25s ease-out;
  box-shadow: 0 5px 5520px #0b0d15;
  box-shadow: 0 0 169px #505569;
  padding: 0 .2em;

  @media (max-width: 900px) {
    padding-top: 55px;
  }
`
// #00b8ff azul focus
const ButtonPlay = styled.button`
  border: ${p => p.focus ? `2px solid ${p.color}` : '2px solid transparent'};
  background-color: #eeeeee;
  padding: .5em 2em;
  border-radius: 30px;
  margin: 1em auto;
  display: block;
  color: #2f1c1c;
  outline: none;
  display: none;
  
  & > i {
    color: #494949;
    font-size: 12px;
    margin-left: 0.3em;
  }

  @media (min-width: 900px) {
    display: block;
  }
`

const ButtonBack = styled.button`
  border: 0;
  padding: 2em;
  position: absolute;
  z-index: 1;
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`

const CoverPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em 0;
  position: relative;
`

const CoverTitle = styled.div`
  text-align: center;
  display: none;

  @media (max-width: 900px) {
    display: block;
  }
`

const Cover = ({ course }) => {
  return (
    <CoverPanel>
      <CoverFade src={course.cover.s100} courseSlug={course.slug} />
      <CoverTitle>{ course.courseTitle }</CoverTitle>
    </CoverPanel>
  )
}

const BarPanel = styled.div`
  background: ${p => p.color};
  will-change: background;
  transition: background .3s ease-out;
  width: 100%;
  height: 50px;
  border-radius: 15px 15px 0 0;
  position: relative;
  overflow: hidden;
`

const BarGradient = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.58));
`
const BarTextBlockMobile = styled.div`
  color: #FFF;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: none;

  @media (max-width: 900px) {
    display: flex;
  }
`
const BarText = styled.div`
  color: #FFF;
  margin-right: 1em;
`

const BarTextBlockDesktop = styled.div`
  color: #FFF;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: none;

  @media (min-width: 900px) {
    display: flex;
  }
`

const BarTitle = styled.div`
  color: #FFF;
`

const Bar = ({ color, hasStartted, title }) => (
  <BarPanel color={color}>
    <BarGradient />
    <BarTextBlockMobile>
      <BarText>Reproducir</BarText>
      <i className='icon-play' />
    </BarTextBlockMobile>
    <BarTextBlockDesktop>
      <BarTitle>{title}</BarTitle>
    </BarTextBlockDesktop>
  </BarPanel>
)

const Lessons = styled.ul`
  margin: 0;
  padding: 0;
  border: 1px solid #e1e1e1;
`

export default class extends Component {
  panel = React.createRef()

  // Si la interaccion es por keyboard
  // se mueve el scroll del panel
  componentDidUpdate () {
    if (this.props.interaction === 'keyboard') {
      if (this.props.index2 > 7) {
        const panel = ReactDOM.findDOMNode(this.panel.current)
        panel.scrollTop = panel.scrollTop + 55
      } else if (this.props.index2 < this.props.courseDetails.lessons.length - 7) {
        const panel = ReactDOM.findDOMNode(this.panel.current)
        panel.scrollTop = panel.scrollTop - 55
      }
    }
  }

  render () {
    const { courseInFocus, courseDetails, index2, isMobile, loadingDetails } = this.props
    if (!courseInFocus.slug) return null

    return (
      <Panel show={this.props.show} isMobile={isMobile} ref={this.panel}>
        <ButtonBack onClick={this.props.hideDetails}><i className='icon-back' /></ButtonBack>
        <Cover course={courseInFocus} />

        <ButtonPlay
          color={courseInFocus.color}
          focus={index2 === 0}
          onClick={this.props.onPlayCourse}
          onMouseOver={() => this.props.onSetIndex2(0)}
        >
          Reproducir <i className='icon-play' />
        </ButtonPlay>

        <Bar color={courseInFocus.color} title={courseInFocus.courseTitle} />
        { loadingDetails
          ? <Ellipsis width='100px' show />
          : (

            <Lessons>
              {courseDetails.lessons.map((lesson, index) => (
                <DetailsItem
                  color={courseInFocus.color}
                  lesson={lesson}
                  course={courseInFocus}
                  onChangeLesson={this.props.onChangeLesson}
                  focus={index === index2 - 1}
                  onSetIndex2={this.props.onSetIndex2}
                  index={index}
                />
              ))}
            </Lessons>
          )
        }
      </Panel>
    )
  }
}
