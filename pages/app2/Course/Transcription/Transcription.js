import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import Header from './Header'
import Video from './Video'
import PushWatched from './PushWatched'
import { LESSON } from '../../queries'
import Markdown from '../../../../components/md/Markdown'

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

export default ({ force, course, lessonSlug }) => {
  if (!lessonSlug) return null

  return (
    <Query query={LESSON} variables={{ slug: lessonSlug }}>
      {({ data, loading, error }) => {
        if (loading) return <h1>Loading*************************************</h1>
        if (error) return <h1>Error {error}</h1>
        const { lesson } = data
        return (
          <Content>
            <FullContent>
              <Video videoSource={data.lesson.videoSource} />
              <AditionalButtons>
                <PushWatched course={course} lesson={lesson} force={force} />
                <Button icon='icon-snippet' />
                <Button icon='icon-love' />
                <Button icon='icon-arrow-right' border>{ lesson.title || 'Curso Completado' }</Button>
              </AditionalButtons>
              <Header course={course} lesson={lesson} />
              <MarkdownContent>
                <Markdown
                  course={course}
                  lesson={lesson}
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
