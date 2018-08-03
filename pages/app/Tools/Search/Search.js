import React, {Component} from 'react'
import gpl from 'graphql-tag'
import Mousetrap from 'mousetrap'
import styled, {keyframes} from 'styled-components'
import Box from '../Box'
import SearchBox from '../SearchBox'
import getTechIcon from '../../getTechIcon'
import CourseDatails from './CourseDetails'
import { Ellipsis } from '../../../../components/Spinners'

const ALL_COURSES = gpl`
query search($text: String!) {
  search(text: $text) {
    ... on Course {
      courseTitle: title
      slug
      _id
      color
      tech
      description
      cover {
        medium
      }
    }
    
    ... on Lesson {
      lessonTitle: title
      _id
      slug
      tech
    }
  }
}`

const COURSE_DETAILS = gpl`
query search($slug: String!) {
  course(slug: $slug) {
    title
    slug
    _id
    cover {
      medium
    }
    description
    lessons {
      title
      description
      synopsis
      slug
      _id
    }
  }
}`

// const SearchBox
const Panel = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 55px;
  background-color: #0b0d15;
  height: 100%;
`

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

const AnimaLeft = keyframes`
  0% {
    left: 0;
  }
  50% {
    left: 20px;
  }
  100% {
    left: 0;
  }
`

const List = styled.ul`
 padding: .3em .5em;
 width: 100%;
 position: relative;
 animation: ${p => p.leftAnimate ? `.3s ease-in-out ${AnimaLeft}` : ''};
 animation-fill-mode: forwards;
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
  font-size: 12px;
  animation: .4s ease-out ${Anima};
  /* animation-fill-mode: forwards; */
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
`
const PlayIcon = styled.i`
  color: #FFF;
  font-size: 5px;
`

const Lesson = (props) => (
  <Item {...props}>
    <Tech tech={props.tech} size='20px' />
    {props.lessonTitle}
    <PlayIcon className='icon-play-1' />
  </Item>
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
const Course = (props) => (
  <Item {...props} bg={props.color}>
    <CourseShadow src='/static/shadow-1.svg' />
    <Tech tech={props.tech} />
    {props.courseTitle}
    <CourseIco className='icon-arrow-right' />
  </Item>
)

class SearchComponent extends Component {
  state = {
    search: [],

    // Representa el indice activo // primer nivel
    index1: 0,

    // Represeta el indice activo // Segundo nivel Course details
    index2: 0,

    // Representa que seccion esta en foco search or course details
    // search | courseDetails | lessonDetails
    sectionInFocus: 'search',

    searchFetching: false,

    // Si ya realizo alguna busqueda o no
    hasSearched: false,

    // Objeto usado para consumir el curso en foco
    courseInFocus: { lessons: [], cover: {} },

    // Objeto que se carga con los datos del servidor
    courseDetails: { lessons: [], cover: {} }
  }

  componentDidMount = () => {
    // TODO - Hacer que se puedan manupular
    // Desde el teclado con las flechas
    if (process.browser) {
      Mousetrap.bind('down', this.onArrowDown)
      Mousetrap.bind('up', this.onArrowUp)
      Mousetrap.bind('left', this.onArrowLeft)
      Mousetrap.bind('right', this.onArrowRight)
      Mousetrap.bind('f', this.focus, 'keyup')
    }
  }

  componentWillUnmount () {
    Mousetrap.unbind('down')
    Mousetrap.unbind('up')
  }

  focus = () => {
    this.setState({ index1: 0, index2: 0, sectionInFocus: 'search' })
  }

  onArrowDown = (e) => {
    if (e) e.preventDefault()
    // Que la seccion en foco sea search
    // o courseDetails | lessonDetails
    const { sectionInFocus, index1, index2, search, courseDetails } = this.state

    if (sectionInFocus === 'search') {
      if (index1 < search.length) {
        this.setState({ index1: index1 + 1 })
      }
    }

    if (sectionInFocus === 'courseDetails') {
      if (index2 < courseDetails.lessons.length) {
        this.setState({ index2: index2 + 1 })
      }
    }
  }

  onArrowUp = (e) => {
    if (e) e.preventDefault()

    const { sectionInFocus, index1, index2 } = this.state

    if (sectionInFocus === 'search') {
      if (index1 > 0) {
        this.setState({ index1: index1 - 1 })
      }
    }

    if (sectionInFocus === 'courseDetails') {
      if (index2 > 0) {
        this.setState({ index2: index2 - 1 })
      }
    }
  }

  onArrowLeft = (e) => {
    if (this.state.sectionInFocus !== 'search') {
      this.setState({
        sectionInFocus: 'search',
        index2: 0
      })
    } else {
      // agregar animacion
      // this.props.onEscape()
      this.setState({ pop: true })
      window.setTimeout(() => this.setState({ pop: false }), 300)
    }
  }

  // Revisamos si el index en foco es un curso
  // si es asi abrir el panel courseDatails
  onArrowRight = (e) => {
    const { index1, search } = this.state

    const itemInFocus = search[index1 - 1]

    if (itemInFocus.__typename === 'Course') {
      this.setState({
        sectionInFocus: 'courseDetails',
        courseInFocus: itemInFocus
      })

      this.getCourseDetails(itemInFocus.slug)
    } else {
      // Con la leccion reproducir
      // TODO
    }
  }

  onSearch = async (text) => {
    this.setState({ searchFetching: true, hasSearched: true })
    const result = await this.props.client.query({
      query: ALL_COURSES,
      variables: { text }
    })

    this.setState({ search: result.data.search, searchFetching: false })
  }

  getCourseDetails = async (slug) => {
    this.setState({ detailsFetching: true })

    const result = await this.props.client.query({
      query: COURSE_DETAILS,
      variables: { slug }
    })

    this.setState({
      courseDetails: result.data.course,
      detailsFetching: false
    })
  }

  render () {
    const { pop, search, searchFetching, hasSearched, sectionInFocus, index1, index2, courseDetails, courseInFocus, detailsFetching } = this.state
    const showNotFound = search.length === 0 && !searchFetching && hasSearched
    const showSpinner = searchFetching && hasSearched
    const showItems = !searchFetching && hasSearched && search.length
    const isInputFocus = index1 === 0
    const showCourseDetails = sectionInFocus === 'courseDetails'

    return (
      <Box>
        <Panel style={{
          overflow: pop ? 'hidden' : 'auto'
        }}>
          <SearchBox
            onEnter={this.onSearch}
            onArrowDown={this.onArrowDown}
            onArrowUp={this.onArrowUp}
            focus={isInputFocus}
          />
          <Item>{ index1 } - { isInputFocus ? 'true' : 'false' } - { sectionInFocus } - { index2 }</Item>
          <List leftAnimate={pop} >
            { showSpinner ? <Ellipsis width='100px' show /> : null }
            { showNotFound ? 'Not found' : null }
            { showItems
              ? (
                <div>
                  {search.map((e, i) => {
                    const isOpenFs = showCourseDetails && i !== index1 - 1
                    if (e.__typename === 'Course') {
                      return (
                        <Course
                          isInFocus={index1 === i + 1}
                          opacity={isOpenFs ? '.3' : '1'}
                          blur={isOpenFs ? 'blur(2px)' : 'blur(0px)'}
                          {...e}
                        />
                      )
                    }
                    return (
                      <Lesson
                        key={e._id}
                        isInFocus={index1 === i + 1}
                        opacity={isOpenFs ? '.3' : '1'}
                        blur={isOpenFs ? 'blur(1px)' : 'blur(0px)'}
                        {...e}
                      />
                    )
                  })}
                </div>
              )
              : null
            }
          </List>
        </Panel>
        <CourseDatails
          show={showCourseDetails}
          courseInFocus={courseInFocus}
          courseDetails={courseDetails}
          index2={index2}
          detailsFetching={detailsFetching}
        />
      </Box>
    )
  }
}

export default SearchComponent
