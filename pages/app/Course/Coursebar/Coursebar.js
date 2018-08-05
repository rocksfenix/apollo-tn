import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Item from './Item'

const Panel = styled.div`
  width: 100%;
  height: ${p => p.h};
  position: absolute;
  top: 165px;
  transition: all .3s ease-out;
  left: ${props => props.show ? '0' : '-100%'}; 
  z-index: 500;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  width: 280px;
  position: fixed;
  top: 150px;
  z-index: 500;
`

const Wrap = styled.div`
  height: ${p => p.height};
  float: right;
  padding-left: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all .3s ease-out;
`

export default class extends Component {
  state = {
    ripple: -1
  }

  coursebar = React.createRef()

  componentDidUpdate () {
    // Movemos el scroll solo la primera vez
    // Al recargarse la pagina
    // Usamos el onLessonsSetSroll para setear el valor
    // y que solo funcione una sola vez
    if (this.props.setScroll) {
      // Obtenemos la pocicion
      const indexActive = this.getScrollPos()
      const finalScroll = (indexActive * 50) - 50
      let scroll = 0
      // milisecons
      let totalTime = 1300
      let step = finalScroll * 100 / totalTime
      const tick = () => {
        if (scroll < finalScroll) {
          scroll += step
          ReactDOM.findDOMNode(this.coursebar.current).scrollTop = scroll
          window.requestAnimationFrame(tick)
        } else {
          // Al finalizar se activa el ripple de esa leccion
          this.setState({ ripple: indexActive })
        }
      }

      window.requestAnimationFrame(tick)
      // Al inicio se setea para que no se genere
      // bucle infinito
      this.props.onLessonsSetScroll()
    }
  }

  // Regresa el indice de la leccion que es filtrada
  // Por su slug
  getScrollPos = () => {
    const { lessonSlug, course } = this.props

    let indexActive = 0
    course.lessons.forEach((l, i) => {
      if (l.slug === lessonSlug) {
        indexActive = i
      }
    })

    return indexActive
  }

  render () {
    const { course, coursebarHeight, show } = this.props
    const tolerance = 3
    const height = `${course.lessons.length * (50 + tolerance)}px`
    return (
      <Panel ref={this.coursebar} style={{ height: `${coursebarHeight}` }} show={show}>
        <Wrap size={this.props.size} height={height}>
          {this.props.course.lessons.map((lesson, index, a) => (
            <Item
              key={lesson.title}
              next={a[index + 1] || { isWatched: false }}
              active={
                !this.props.lessonSlug && index === 0 ||
                this.props.lessonSlug === lesson.slug
              }
              index={index}
              ripple={this.state.ripple}
              lessons={course.lessons}
              {...lesson}
              {...this.props}
            >
              { lesson.title }
            </Item>
          ))}
        </Wrap>
      </Panel>
    )
  }
}
