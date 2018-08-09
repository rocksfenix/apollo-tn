import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import { Notification } from 'react-notification'
import Fields from './Fields'
import Editor from './Editor'
import Markdown from './Markdown'
import Library from './Library'

const LESSON = gql`
  query lesson ($slug: String!) {
    lesson(slug: $slug) {
      _id
      title
      slug
      synopsis
      videoSource
      tech
      techVersion
      role
      tags
      duration
      screenshot {
        s100
      }
      isPublished
      isTranscriptionPublic
      isRecording
      transcription
    }
  }
`

const LESSON_UPDATE = gql`
  mutation lesson (
      $_id: ID!
      $title: String
      $slug: String
      $synopsis: String
      $videoSource: String
      $tech: String
      $techVersion: String
      $role: String
      $tags: [String]
      $duration: String
      $isPublished: Boolean
      $isTranscriptionPublic: Boolean
      $isRecording: Boolean
      $transcription: String
    ) {
    lessonUpdate(input: {
      _id: $_id
      title: $title
      slug: $slug
      synopsis: $synopsis
      videoSource: $videoSource
      tech: $tech
      techVersion: $techVersion
      role: $role
      tags: $tags
      duration: $duration
      isPublished: $isPublished
      isTranscriptionPublic: $isTranscriptionPublic
      isRecording: $isRecording
      transcription: $transcription
    }) {
      _id
      title
      slug
      synopsis
      videoSource
      tech
      techVersion
      role
      tags
      duration
      screenshot {
        s100
      }
      isPublished
      isTranscriptionPublic
      isRecording
      transcription
    }
  }
`

const animation = keyframes`
  0%{
    transform: scale(.9);
    opacity: 0;
  }
  100%{
    transform: scale(1);
    opacity: 1;
  }
`

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-right: 52px;
  background-color: rgba(0, 0, 0, 0.98);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 900;
  animation: .3s ease-in-out ${animation};
`

const Buttons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 33px;
  background-color: #060507;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #000;
  user-select: none;
`

const ButtonSave = styled.button`
  background-color: #332e36;
  color: #FFF;
  border: 1px solid transparent;
  margin: 0 1em;
  padding: 0 1.5em;
  border-radius: 3px;
  font-family: Roboto;
  font-size: 15px;
  cursor: pointer;
  transition: all .2s ease-out;
  outline: none;

  :hover {
    background: #3b96c0;
  }
`

const PanelButtons = styled.div`
  width: 100%;
  height: 35px;
  background-color: #1d1d28;
  position: absolute;
  top: 33px;
  left: 0;
  user-select: none;
`

const TabsPanel = styled.div`
  width: 480px;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  display: flex;
  user-select: none;
`

const ButtonTab = styled.button`
  background-color: #1d1d28;
  color: #FFF;
  font-size: 16px;
  border: 0;
  height: 100%;
  padding: 0 2em;
  position: relative;
  cursor: pointer;
  font-family: Roboto;
  font-weight: 100;
  outline: none;
`

const Shine = styled.div`
  width: 100%;
  height: 10px;
  background-color: #4970ff;
  position: absolute;
  top: 14px;
  left: 0;
  filter: blur(14px);
  transition: all .2s ease-out;
  opacity: ${p => p.active ? '1' : '0'};
`

const Content = styled.section`
    width: 100%;
    height: 100%;
    top: 68px;
    height: 100%;
    position: relative;
`

const Tab = (props) => (
  <ButtonTab onClick={() => props.onClick(props.label)}>
    <Shine active={props.active} />
    {props.label}
  </ButtonTab>
)

class LessonEditor extends Component {
  state = {
    notification: {
      show: false,
      message: 'Cambios Guardados Exitosamente'
    },
    tab: 'Fields',
    lesson: {
      _id: '',
      title: '',
      slug: undefined,
      synopsis: '',
      videoSource: '',
      tech: '',
      techVersion: '',
      role: '',
      tags: [],
      screenshot: {},
      isPublished: false,
      isTranscriptionPublic: false,
      isRecording: false,
      transcription: '',
      duration: '0'
    }
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.slug !== prevProps.slug) {
      const result = await this.props.client.query({
        query: LESSON,
        variables: { slug: this.props.slug }
      })
      this.setState({ lesson: result.data.lesson })
    }
  }

  tabs = [
    { label: 'Fields' },
    { label: 'Editor' },
    { label: 'Markdown' },
    { label: 'Library' }
  ]

  onChange = (key, value) => {
    this.setState(state => ({
      ...state,
      lesson: {
        ...state.lesson,
        [key]: value
      }
    }))
  }

  saveChanges = async () => {
    const response = await this.props.client.mutate({
      mutation: LESSON_UPDATE,
      variables: { ...this.state.lesson }
    })

    if (!response.data.lessonUpdate) {
      return window.alert('Error al Guardar Informacion')
    }

    this.setState({
      course: response.data.lessonUpdate,
      notification: {
        show: true,
        message: 'Cambios Guardados Exitosamente'
      }
    })

    window.setTimeout(() => this.setState(state => ({
      notification: {
        ...state.notification,
        show: false
      }}
    )), 3000)
  }

  render () {
    if (!this.props.show || !this.props.slug) return null
    return (
      <Panel>
        <Buttons>
          <ButtonSave onClick={this.saveChanges}>Save</ButtonSave>
          <ButtonSave onClick={this.props.hideEditor}>Close</ButtonSave>
          <ButtonSave onClick={() => console.log(JSON.stringify(this.state, null, 2))}>Debugg</ButtonSave>
        </Buttons>
        <PanelButtons>
          <TabsPanel>
            { this.tabs.map(tab => (
              <Tab
                active={tab.label === this.state.tab}
                key={tab.label}
                {...tab}
                onClick={() => this.setState({ tab: tab.label })}
              />
            ))}
          </TabsPanel>
        </PanelButtons>
        <Content>
          <Fields
            lesson={this.state.lesson}
            show={this.state.tab === 'Fields'}
            onChange={this.onChange}
          />
          <Editor
            lesson={this.state.lesson}
            show={this.state.tab === 'Editor'}
            transcription={this.state.lesson.transcription}
            onChange={this.onChange}
          />

          <Markdown
            show={this.state.tab === 'Markdown'}
            markdown={this.state.lesson.transcription}
          />
          <Library
            show={this.state.tab === 'Library'}
          />
          <Notification
            isActive={this.state.notification.show}
            dismissAfter
            message={this.state.notification.message}
          />
        </Content>
      </Panel>
    )
  }
}

export default withApollo(LessonEditor)
