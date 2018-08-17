import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Notification } from 'react-notification'
import TextField from '../../../components/TextField'
import Multioption from '../../../components/Multioption'
import Textarea from '../../../components/Textarea'
import ColorField from '../../../components/ColorField'
import ToggleField from '../../../components/ToggleField'
import TagsField from '../../../components/TagsField'
import SearchLessons from './SearchLessons'
import Preview from './Preview'

const COURSE_DETAILS = gql`
query course($slug: String!) {
  course(slug: $slug) {
    _id
    color
    slug
    title
    role
    serieType
    category
    tech
    trailer
    synopsis
    description
    isPublished
    isRecording
    tags
    duration
    firstLessonSlug
    techVersion
    duration
    level
    cover {
      s100
    }
    lessons {
      title
      synopsis
      slug
      _id
      duration
    }
  }
}`
//  $lessons: String
const COURSE_UPDATE = gql`
mutation courseUpdate(
  $_id: ID!
  $duration: String
  $firstLessonSlug: String
  $techVersion: String
  $level: String
  $color: String
  $title: String
  $role: String
  $serieType: String
  $category: String
  $tech: String
  $trailer: String
  $synopsis: String
  $description: String
  $isPublished: Boolean
  $isRecording: Boolean
  $tags: [String]
  $lessons: [String]
) {
  courseUpdate(input: {
    _id: $_id
    duration: $duration
    firstLessonSlug: $firstLessonSlug
    level: $level
    techVersion: $techVersion
    color: $color
    title: $title
    role: $role
    serieType: $serieType
    category: $category
    tech: $tech
    trailer: $trailer
    synopsis: $synopsis
    description: $description
    isPublished: $isPublished
    isRecording: $isRecording
    tags: $tags
    lessons: $lessons
  }) {
    _id
    color
    firstLessonSlug
    duration
    techVersion
    level
    slug
    title
    role
    serieType
    category
    tech
    trailer
    synopsis
    description
    isPublished
    isRecording
    tags
    cover {
      s100
    }
    lessons {
      _id
      slug
      title
      tech
      duration
    }
  }
}`

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
  z-index: 1000;
  animation: .3s ease-in-out ${animation};
`

const Fields = styled.div`
  width: ${p => p.width || '30%'};
  height: 100%;
  background-color: #FFF;
  top: 55px;
  position: relative;
`

const FieldsWrap = styled.div`
  width: 95%;
  margin: 0 auto;
`

const Buttons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
  background-color: #060507;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonSave = styled.button`
  background-color: #332e36;
  color: #FFF;
  border: 1px solid transparent;
  margin: 0 1em;
  padding: .4em 1.5em;
  border-radius: 3px;
  font-family: Roboto;
  font-size: 15px;
  cursor: pointer;
  transition: all .2s ease-out;

  :hover {
    background: #3b96c0;
  }
`

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Column = styled.div`
  width: 50%;
`

export default class extends Component {
  state = {
    notification: {
      show: false,
      message: 'Cambios Guardados Exitosamente'
    },
    course: {
      title: 'The title',
      tech: '',
      role: 'pro',
      serieType: 'course',
      description: '',
      category: 'frontend',
      color: '#333',
      isPublished: false,
      isRecording: true,
      tags: ['javascript'],
      lessons: [],
      cover: {}
    }
  }

  onChange = (key, value) => {
    this.setState(state => ({
      ...state,
      course: {
        ...state.course,
        [key]: value
      }
    }))
  }

  pushData = (course) => {
    // Solo actualiza la primera vez o cada que cabie de slug
    if (!this.state.course.__typename || course._id !== this.state.course._id) {
      this.setState({
        course
      })
    }
  }

  sumDurations = (durations) => {
    return durations.reduce((sum, string) => {
      var mins, secs;
      [mins, secs] = string.split(':').slice(-2).map(n => parseInt(n, 10))
      return sum + mins * 60 + secs
    }, 0)
  }

  // Entrada 324
  // Salida '5:24'
  formatDuration = (duration) => {
    function pad (number) {
      return `${number}`.slice(-2)
    }

    let hours = duration / 3600 | 0
    let minutes = duration % 3600 / 60 | 0
    let seconds = duration % 60
    let minsSecs = `${pad(minutes)}:${pad(seconds)}`
    return hours > 0 ? `${hours}:${minsSecs}` : minsSecs
  }

  getTotalDuration = () => {
    // ["4:23", "4:23", "4:23"]
    const durations = this.state.course.lessons.map(l => l.duration)
    // total de duration ex 132
    const totalDuration = this.sumDurations(durations)
    // suma de duraciones en numero
    const duration = this.formatDuration(totalDuration)
    // debugger
    return duration
  }

  updateCourse = async () => {
    const response = await this.props.client.mutate({
      mutation: COURSE_UPDATE,
      variables: {
        ...this.state.course,
        lessons: this.state.course.lessons.map(l => l._id),
        firstLessonSlug: this.state.course.lessons.length
          ? this.state.course.lessons[0].slug
          : '__NO_LESSONS',
        duration: this.getTotalDuration()
      }
    })

    if (!response.data.courseUpdate) {
      return window.alert('Error al Guardar Informacion')
    }

    this.setState({
      course: response.data.courseUpdate,
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

  onClickLesson = (lessons) => {
    // hardcode
    // this.state.course.lessons = lessons
    this.setState(state => ({
      ...state,
      course: { ...state.course, lessons }
    }), () => this.setState(state => ({
      ...state,
      course: { ...state.course, duration: this.getTotalDuration() }
    })))
  }

  onSortEnd = (lessons) => this.setState(state => ({
    ...state,
    course: { ...state.course, lessons }
  }))

  onDelete = (lesson) => {
    // Primero actualizamos las lecciones
    this.setState(state => ({
      ...state,
      course: {
        ...state.course,
        lessons: state.course.lessons.filter(l => l._id !== lesson._id)
      }
    }), () => {
      // En el callback obtenemos la duraccion actual de la suma de las lecciones
      this.setState(state => ({
        ...state,
        course: { ...state.course, duration: this.getTotalDuration() }
      }))
    })
  }

  render () {
    if (!this.props.show || !this.props.slug) return null
    return (
      <Query query={COURSE_DETAILS} variables={{ slug: this.props.slug }}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          if (data.course) {
            this.pushData(data.course)
          }
          return (
            <Panel>
              <Fields width='40%'>
                <FieldsWrap>
                  <TextField
                    label='title'
                    keyName='title'
                    size='medium'
                    onChange={this.onChange}
                    value={this.state.course.title}
                  />
                  <ColorField
                    label='Color'
                    keyName='color'
                    color={this.state.course.color}
                    onChange={this.onChange}
                  />
                  <Multioption
                    label='role'
                    keyName='role'
                    active={this.state.course.role}
                    options={[
                      { value: 'pro' },
                      { value: 'free' },
                      { value: 'public' }
                    ]}
                    onChange={this.onChange}
                  />
                  <Multioption
                    label='Serie Type'
                    keyName='serieType'
                    active={this.state.course.serieType}
                    options={[
                      { value: 'course' },
                      { value: 'tutorial' }
                    ]}
                    onChange={this.onChange}
                  />
                  <Multioption
                    label='Category'
                    keyName='category'
                    active={this.state.course.category}
                    options={[
                      { value: 'frontend' },
                      { value: 'backend' },
                      { value: 'herramientas' }
                    ]}
                    onChange={this.onChange}
                  />
                  <Multioption
                    label='Level'
                    keyName='level'
                    active={this.state.course.level}
                    options={[
                      { value: 'basico' },
                      { value: 'intermedio' },
                      { value: 'avanzado' }
                    ]}
                    onChange={this.onChange}
                  />
                  <TextField
                    label='tech'
                    keyName='tech'
                    size='small'
                    onChange={this.onChange}
                    value={this.state.course.tech}
                  />
                  <TextField
                    label='trailer'
                    keyName='trailer'
                    size='small'
                    onChange={this.onChange}
                    value={this.state.course.trailer}
                  />
                  <TextField
                    label='synopsis'
                    keyName='synopsis'
                    size='small'
                    onChange={this.onChange}
                    value={this.state.course.synopsis}
                  />
                  <TextField
                    label='First Lesson Slug'
                    keyName='firstLessonSlug'
                    size='small'
                    onChange={this.onChange}
                    value={this.state.course.firstLessonSlug}
                  />
                  <Row>
                    <Column>
                      <TextField
                        inputWidth='80px'
                        borderRight='1px solid #e9f3f5'
                        label='Tech Version'
                        keyName='techVersion'
                        size='small'
                        onChange={this.onChange}
                        value={this.state.course.techVersion}
                      />
                    </Column>
                    <Column>
                      <TextField
                        inputWidth='80px'
                        label='Duration'
                        keyName='duration'
                        size='small'
                        onChange={this.onChange}
                        value={this.state.course.duration}
                      />
                    </Column>
                  </Row>

                  <Textarea
                    label='Description'
                    keyName='description'
                    onChange={this.onChange}
                    value={this.state.course.description}

                  />
                  <Row>
                    <Column>
                      <ToggleField
                        label='Is Published'
                        keyName='isPublished'
                        active={this.state.course.isPublished}
                        onChange={this.onChange}
                      />
                    </Column>
                    <Column>
                      <ToggleField
                        label='Is Recording'
                        keyName='isRecording'
                        active={this.state.course.isRecording}
                        onChange={this.onChange}
                      />
                    </Column>
                  </Row>

                  <TagsField
                    label='tags'
                    keyName='tags'
                    onChange={this.onChange}
                    tags={this.state.course.tags}
                  />
                </FieldsWrap>
              </Fields>
              <Fields width='25%'>
                <SearchLessons
                  {...this.props}
                  lessons={this.state.course.lessons}
                  onClickLesson={this.onClickLesson}
                />
              </Fields>
              <Fields>
                <Preview
                  lessons={this.state.course.lessons}
                  onSortEnd={this.onSortEnd}
                  onDelete={this.onDelete}
                  course={this.state.course}
                />
              </Fields>
              <Buttons>
                <ButtonSave onClick={this.updateCourse}>Save</ButtonSave>
                <ButtonSave onClick={this.props.hideEditor}>Close</ButtonSave>
                <ButtonSave onClick={() => console.log(JSON.stringify(this.state, null, 2))}>Debugg</ButtonSave>
              </Buttons>
              <Notification
                isActive={this.state.notification.show}
                dismissAfter
                message={this.state.notification.message}
              />
            </Panel>
          )
        }}
      </Query>
    )
  }
}
