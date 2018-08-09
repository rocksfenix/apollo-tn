import React from 'react'
import styled from 'styled-components'
import VideoLevelUp from './VideoLevelUp'
import Header from './Header'
import Markdown from '../../../../components/md/Markdown'

const Content = styled.div`
  position: relative;
`
const MarkdownContent = styled.div`
  max-width: 710px;
  margin: 50px auto;
`

const AditionalButtons = styled.div`
  border-bottom: 1px solid #f7f7f7;
  height: 55px;
  display: flex;
  justify-content: flex-end;
  text-shadow: 0 0 black;
  align-items: center;
`

const But = styled.button`
  border: ${p => p.border ? '1px solid #222831' : 'initial'};
  border-radius: 3px;
  font-size: 16px;
  padding: .3em 1.3em;
  margin: 0 .3em;
  background-color: #FFF;
  color: rgb(228, 232, 239);
  transition: all .25s ease-out;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    border: 2px solid #efe1fb;
    color: rgb(101, 113, 132);
  }
`
const Button = ({ children, icon, border }) => (
  <But border={border}>
    {children} <i className={icon} />
  </But>
)

export default ({ width, left, course, lesson }) => {
  if (!lesson) {
    return null
  }
  let current = 0
  course.lessons.forEach((l, index) => {
    // debugger
    if (l.slug === lesson.slug) {
      current = index
    }
  })

  const nextLesson = course.lessons[current + 1] || {}

  const style = {
    width,
    left
  }

  return (
    <Content show style={style}>
      <VideoLevelUp />
      <AditionalButtons>
        <Button icon='icon-snippet' />
        <Button icon='icon-heart-1' />
        <Button icon='icon-arrow-right' border>{ nextLesson.title || 'Curso Completado' }</Button>
      </AditionalButtons>
      <Header course={course} lesson={lesson} />
      <MarkdownContent>
        <Markdown
          markdown={lesson.transcription}
        />
      </MarkdownContent>
    </Content>
  )
}
