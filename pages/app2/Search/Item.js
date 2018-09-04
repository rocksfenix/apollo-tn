import React from 'react'
import styled, {keyframes} from 'styled-components'
import getTechIcon from '../../../util/getTechIcon'

const Anima = keyframes`
  0% {
    opacity: 0;
    bottom: 30px;
  }
  100% {
    opacity: 1;
    bottom: 0;
  }
`

const LogoTech = styled.div`
  width: ${p => p.size};
  height: ${p => p.size};
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`
const LogoImg = styled.img`
  width: 55%;
`

const Tech = ({ tech, size = '30px' }) => (
  <LogoTech size={size}>
    <LogoImg src={getTechIcon(tech)} />
  </LogoTech>
)

const Item = styled.li`
  color: #FFF;
  position: relative;
  font-size: 14px;
  animation: .4s ease-out ${Anima};
  position: relative;
  list-style: none;
  padding: .7em .1em;
  background: ${p => p.bg || 'transparent'};
  border: ${p => p.isInFocus ? '2px solid #FFF' : '2px solid transparent'};
  overflow: hidden;
  display: flex;
  justify-content:space-between;
  align-items: center;
  opacity: ${p => p.opacity || 1};
  filter: ${p => p.blur};
  font-weight: 100;
  letter-spacing: .3px;
  text-shadow: 0 0 5px black;
  margin: .2em 0;
`
const PlayIcon = styled.i`
  color: #FFF;
  font-size: 5px;
`

const LessonItem = styled(Item)`
  justify-content: end;
`

export const Lesson = (props) => (
  <LessonItem {...props}>
    <Tech tech={props.tech} size='30px' />
    {props.lessonTitle}
    <PlayIcon className='icon-play-1' />
  </LessonItem>
)

const CourseShadow = styled.img`
  position: absolute;
  right: 0;
  width: 69%;
  top: 0;
`

const CourseIco = styled.i`
  color: #FFF;
`

const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(13deg, transparent, rgba(0, 0, 0, 0.65));
  width: 100%;
  height: 100%;
  z-index: -1;
`

export const Course = (props) => (
  <Item {...props} bg={props.color}>
    <Gradient />
    <CourseShadow src='/static/shadow-1.svg' />
    <Tech tech={props.tech} />
    {props.courseTitle}
    <CourseIco className='icon-arrow-right' />
  </Item>
)
