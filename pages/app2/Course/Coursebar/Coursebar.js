import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Item from './Item'

const Panel = styled.div`
  position: relative;
  width: 300px;
  flex-shrink: 0;
  height: 100%;
  z-index: 500;
  border-right: 1px solid #e5e5e5;
  overflow: hidden;
  width: 300px;
  position: absolute;
  transform: ${p => p.show ? 'translateX(0%)' : 'translateX(-120%)'};
  will-change: transform;
  transition: transform 530ms cubic-bezier(1,0,0,1);
  z-index: 600;
  background-color: #FFF;
  display: flex;
  flex-direction: column;

  @media (max-width:900px) {
    width: 100%;
  }
`

const Header = styled.header`
  width: 100%;
  height: 150px;
  background-color: transparent;
  flex-shrink: 0;
`

const Lessons = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
`

export default class extends Component {
  render () {
    const { isMobile, tab, course, showMobileNav } = this.props
    let show = true

    let orientation = ''

    if (process.browser) {
      orientation = window.screen.orientation.type
    }
    // Si es mobile y no esta mostrado ocultar
    if (isMobile && !showMobileNav) {
      show = false
    }

    console.log(course)
    return (
      <Panel ref={this.coursebar} show={show}>
        <Header>*</Header>
        <Lessons>
          {course.lessons.map((lesson, index, a) => (
            <Item
              key={lesson.title}
              next={a[index + 1] || { isWatched: false }}
              active={(!this.props.lesson.slug && index === 0) || this.props.lesson.slug === lesson.slug}
              index={index}
              // ripple={this.state.ripple}
              lessons={course.lessons}
              {...lesson}
              {...this.props}
            >
              { lesson.title }
            </Item>
          ))}
        </Lessons>
      </Panel>
    )
  }
}
