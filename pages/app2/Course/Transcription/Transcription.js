import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import Markdown from '../../../../components/md/Markdown'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Video from './Video'

const LESSON = gql`
  query lesson ($slug: String!) {
    lesson(slug: $slug) {
      _id
      slug
      title
      role
      tech
      transcription
      videoSource
      isTranscriptionPublic
      isPublished
      duration
      createdAt
      screenshot {
        s100
      }
    }
  }
`

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #FFF;
  flex-grow: 1;
  overflow: hidden;

  @media (min-width:900px) {
    padding-left: 300px;
  }   
`
const MarkdownContent = styled.div`
  max-width: 750px;
  margin: 50px auto;

  @media (max-width:900px) {
    padding: 0 1.3em;;
  }  
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

const FullContent = styled.div`
  overflow-y: auto;
  height: 100vh;
  margin: 0 auto;
`

export default ({ width, left, course, lesson }) => {
  // if (!lesson) {
  //   return null
  // }
  // let current = 0
  // course.lessons.forEach((l, index) => {
  //   // debugger
  //   if (l.slug === lesson.slug) {
  //     current = index
  //   }
  // })

  // const nextLesson = course.lessons[current + 1] || {}
  return (
    <Query query={LESSON} variables={{ slug: lesson.slug }}>
      {({ data, loading, error }) => {
        if (loading) return <h1>Loading*************************************</h1>
        if (error) return <h1>Error {error}</h1>
        return (
          <Content>
            <FullContent>
              <Video videoSource={data.lesson.videoSource} />
              <AditionalButtons>
                <Button icon='icon-snippet' />
                <Button icon='icon-love' />
                <Button icon='icon-arrow-right' border>{ lesson.title || 'Curso Completado' }</Button>
              </AditionalButtons>
              <Header course={course} lesson={lesson} />
              <MarkdownContent>
                <Markdown
                  markdown={lesson.transcription}
                />
              </MarkdownContent>
            </FullContent>

          </Content>
        )
      }}
    </Query>
  )
}
