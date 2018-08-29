import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import { Notification } from 'react-notification'
import Fields from './Fields'
import Editor from './Editor'
import Markdown from './Markdown'
import Library from './Library'

const LESSONS = gql`
 query allLessons($first: Int, $skip: Int, $text: String) {
    allLessons (first: $first, skip: $skip, text: $text) {
      lessons {
        slug
        title
        _id
        role
        tech
        isTranscriptionPublic
        isPublished
        duration
        createdAt
        screenshot {
          s100
        }
      }
      total
    }
  }
`

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
      createdAt
      screenshot {
        s100
      }
      isPublished
      isTranscriptionPublic
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
      createdAt
      screenshot {
        s100
      }
      isPublished
      isTranscriptionPublic
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

const LESSON_DELETE = gql`
  mutation lessonDelete ($_id: ID!) {
    lessonDelete(_id: $_id) {
      _id
      title
    }
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
  flex-direction: column;
  z-index: 900;
  animation: .3s ease-in-out ${animation};
`

const Buttons = styled.div`
  width: 100%;
  height: 55px;
  background-color: #060507;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

const ButtonSave = styled.button`
  background-color: #4d4b65;
  color: #FFF;
  border: 1px solid transparent;
  margin: 0 1em;
  padding: .4em 1.5em;
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

const Icon = styled.i`
  margin-right: 1em;
`

const PanelButtons = styled.div`
  width: 100%;
  height: 35px;
  background-color: #1d1d28;
  user-select: none;
  flex-shrink: 0;
`

const TabsPanel = styled.div`
  width: 480px;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  display: flex;
  user-select: none;
  flex-shrink: 0;
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
  margin-top: 1em;
  position: relative;
  flex-grow: 1;
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

    // Actualizamos cache de Apollo
    const { allLessons } = this.props.client.cache.readQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 }
    })

    this.props.client.cache.writeQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 },
      data: {
        allLessons: {
          ...allLessons,
          lessons: allLessons.lessons.map(c => c._id === response.data.lessonUpdate._id ? response.data.lessonUpdate : c)
        }
      }
    })

    this.setState({
      lesson: response.data.lessonUpdate,
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

  deleteLesson = async () => {
    const title = window.prompt('Para eliminar ingresa el titulo de la leccion')

    if (!title) return

    if (this.state.lesson.title !== title) {
      return window.alert('El titulo ingresado no es valido')
    }

    const res = await this.props.client.mutate({
      mutation: LESSON_DELETE,
      variables: { _id: this.state.lesson._id }
    })

    // Actualizamos cache de Apollo
    const { allLessons } = this.props.client.cache.readQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 }
    })

    this.props.client.cache.writeQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 },
      data: {
        allLessons: {
          ...allLessons,
          lessons: allLessons.lessons.filter(c => c._id !== res.data.lessonDelete._id)
        }
      }
    })

    this.props.hideEditor()
  }

  render () {
    if (!this.props.show || !this.props.slug) return null
    return (
      <Panel>
        <Buttons>
          <ButtonSave onClick={this.saveChanges}><Icon className='icon-save' /> Save </ButtonSave>
          <ButtonSave onClick={this.props.hideEditor}> <Icon className='icon-cross' />Close</ButtonSave>
          <ButtonSave onClick={this.deleteLesson}><Icon className='icon-remove' />Delete  </ButtonSave>
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
