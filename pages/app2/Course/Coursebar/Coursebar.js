import React, {Component} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Item from './Item'
import Autoplay from './Autoplay'
import ColorMode from './ColorMode'

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
  background-color: ${p => p.colorMode === 'light' ? '#FFF' : '#232427'};
  display: flex;
  flex-direction: column;

  @media (max-width:900px) {
    width: 100%;
  }
`

const Lessons = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 900px) {
    ::-webkit-scrollbar {
      width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #FFF
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: gray;
      border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #b30000; 
  }
  }
`

const Header = styled.header`
  width: 100%;
  height: 150px;
  background-color: transparent;
  flex-shrink: 0;
  box-shadow: ${p => p.colorMode === 'light' ? '0 0 32px rgba(0, 0, 0, 0.1)' : '0 0 32px rgba(255, 255, 255, 0.25)'};
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  @media screen and (orientation: landscape) and (max-width: 900px) {
    height: 100px;
    flex-direction: row;
  }

   @media (max-width: 900px) {
    padding-left: 55px;
  }
`

const Buttons = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const CoverImage = styled.img`
  width: 80px;

`

const CourseTitle = styled.div`
  color: ${p => p.colorMode === 'light' ? 'black' : '#FFF'};
`

const Cover = styled.div`
  width: 100%;
  height:120px;
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default class extends Component {
  // Performance
  // shouldComponentUpdate (nextProps, nextState) {
  //   return (
  //     nextProps.colorMode !== this.props.colorMode ||
  //     nextProps.course._id !== this.props.course._id ||
  //     nextProps.autoplay !== this.props.autoplay ||
  //     nextProps.showMobileNav !== this.props.showMobileNav ||
  //     nextProps.isMobile !== this.props.isMobile ||
  //     nextProps.lesson.slug !== this.props.lesson.slug
  //   )
  // }

  render () {
    const { isMobile, course, showMobileNav, colorMode, autoplay } = this.props
    let show = true

    // Si es mobile y no esta mostrado ocultar
    if (isMobile && !showMobileNav) {
      show = false
    }

    // console.log('UP COURSEBAR')

    return (
      <Panel ref={this.coursebar} show={show} colorMode={colorMode}>
        <Header colorMode={colorMode}>
          <Cover>
            <CoverImage src={course.cover.s100} />
            <CourseTitle colorMode={colorMode}>
              {course.title}
            </CourseTitle>
          </Cover>
          <Buttons>
            <ColorMode
              colorMode={colorMode}
              onSetColorMode={this.props.onSetColorMode}
            />
            <Autoplay
              autoplay={autoplay}
              onSetAutoplay={this.props.onSetAutoplay}
            />
          </Buttons>
        </Header>
        <Lessons>
          {course.lessons.map((lesson, index, a) => (
            <Item
              key={lesson._id}
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
