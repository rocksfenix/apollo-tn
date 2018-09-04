import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Mousetrap from 'mousetrap'
import Router from 'next/router'
import styled from 'styled-components'
import Box from '../Box'
import SearchBox from './SearchBox'
import { SEARCH, COURSE_DETAILS } from './search-queries'
import { withApollo } from 'react-apollo'
import { Lesson, Course } from './Item'
import CourseDatails from './CourseDetails'

const Panel = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 55px;
  background-color: #0b0d15;
  height: 100%;
  width: 100%;
`

const SearchItems = styled.div`
  width: 95%;
  overflow: auto;
`

class SearchComponent extends Component {
  searchItems = React.createRef()
  state = {
    // Representra los items de busqueda
    search: [],

    // Representa el indice activo // primer nivel
    index1: 0,

    // Represeta el indice activo // Segundo nivel Course details
    index2: 0,

    // Representa que seccion esta en foco search or course details
    // search | courseDetails | lessonDetails
    sectionInFocus: 'search',

    // Es el tipo de interaccion que se tiene
    // puede ser keyboard o mouse
    interaction: 'keyboard',

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
      Mousetrap.bind('enter', this.onEnter)
      Mousetrap.bind('right', this.onArrowRight)
      Mousetrap.bind('left', this.onArrowLeft)
      // Mousetrap.bind('f', this.focus, 'keyup')
      // Mousetrap.bind('b', this.focus, 'keyup')
      // Mousetrap.bind('ctrl+f', this.focus, 'keyup')

      this.searchItemsEl = ReactDOM.findDOMNode(this.searchItems.current)
    }
  }

  onArrowDown = (e) => {
    if (e) e.preventDefault()
    this.setState({ interaction: 'keyboard' })
    // Que la seccion en foco sea search
    // o courseDetails | lessonDetails
    const { sectionInFocus, index1, index2, search, courseDetails } = this.state

    // console.log('sectionInFocus', sectionInFocus, index2)
    // Si es mayor a 7 movemos scroll
    if (index1 > 7) {
      // console.log('BAJAR SCROLL', this.searchItemsEl)
      this.searchItemsEl.scrollTop = this.searchItemsEl.scrollTop + 55
    }

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
    this.setState({interaction: 'keyboard'})
    const { sectionInFocus, index1, index2 } = this.state

    // Si es mayor a 7 movemos scroll
    if (index1 > 7) {
      this.searchItemsEl.scrollTop = this.searchItemsEl.scrollTop - 55
    }

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
  onArrowRight = (e) => {
    // Revisamos si el index en foco es un curso
    // si es asi abrir el panel courseDatails
    const { index1, search } = this.state

    const itemInFocus = search[index1 - 1]

    if (itemInFocus.__typename === 'Course') {
      this.setState({
        sectionInFocus: 'courseDetails',
        courseInFocus: itemInFocus
      })
      this.getCourseDetails(itemInFocus.slug)
    }
  }

  onArrowLeft = (e) => {
    if (this.state.sectionInFocus !== 'search') {
      this.setState({
        sectionInFocus: 'search',
        index2: 0
      })
    } else {
      // Animacion
      // this.setState({ pop: true })
      // window.setTimeout(() => this.setState({ pop: false }), 300)
    }
  }

  onEnter = (e) => {
    const { sectionInFocus, courseDetails, search, index1, index2 } = this.state

    // Si se encuenta en la ventana de Busqueda
    if (sectionInFocus === 'search') {
      const itemInFocus = search[index1 - 1]

      console.log(itemInFocus)
      // Si es un curso, carga el curso
      if (itemInFocus.__typename === 'Course') {
        this.push(itemInFocus.slug, '')
      }

      // Si es una leccion, ir al curso/leccion
      if (itemInFocus.__typename === 'Lesson') {
        this.push(itemInFocus.courseSlug, itemInFocus.slug)
      }
    }

    // Redirige al curso o leccion de curso
    // Si se encuenta en la ventana de courseDetails
    if (sectionInFocus === 'courseDetails') {
      if (index2 === 0) {
        // Pushea curso leccion 1
        this.push(courseDetails.slug, '')
      }
      if (index2 > 0) {
        // Pushea leccion especifica
        const courseSlug = courseDetails.slug
        const lessonSlug = courseDetails.lessons[index2 - 1].slug
        this.push(courseSlug, lessonSlug)
      }
    }
  }

  // Se ejecuta desde el CourseDetails
  // En boton Reproducir / Reanudar
  onPlayCourse = () => {
    this.push(this.state.courseDetails.slug, '')
  }

  // Se dispara al hacer enter en InputSearch
  // Realiza una busqueda y actualiza el state.search
  onSearch = async (text) => {
    this.setState({ searchFetching: true, hasSearched: true })
    const res = await this.props.client.query({
      query: SEARCH,
      variables: { text }
    })

    // console.log(res)
    this.setState({ search: res.data.search, searchFetching: false })
  }

  onMouseOver = (index1) => {
    this.setState({
      // Dependiento de la interaccion
      // sectionInFocus: 'search',
      index1: index1 + 1,
      interaction: 'mouse'
    })
  }

  // Se ejecuta cuando se hace click
  // en seach item
  onClickCourse = () => {
    const { index1, search } = this.state

    const courseInFocus = search[index1 - 1]

    this.setState({
      sectionInFocus: 'courseDetails',
      courseInFocus
    })

    this.getCourseDetails(courseInFocus.slug)
  }

  // Se dispara al hacer click en un item de leccion
  // resultado de la busqueda
  // recibe el item de la leccion
  onClickLesson = ({ slug, courseSlug }) => {
    this.push(courseSlug, slug)
  }

  // Se dispara desde courseDetails
  // Para cambiar de curso/leccion
  onChangeLesson = (lessonSlug) => {
    const courseSlug = this.state.courseInFocus.slug
    this.push(courseSlug, lessonSlug)
    this.setState({ index1: 0 })
  }

  getCourseDetails = async (slug) => {
    this.setState({ loadingDetails: true })

    const result = await this.props.client.query({
      query: COURSE_DETAILS,
      variables: { slug }
    })

    this.setState({
      courseDetails: result.data.course,
      loadingDetails: false
    })
  }

  // Actualiza url y envia nueva informacion
  // a app para que se hagan las renderizaciones
  // necesarias
  push = (courseSlug, lessonSlug) => {
    // Se actualiza URL
    Router.push(
      `/app2?tab=curso&curso=${courseSlug}&lesson=${lessonSlug}`,
      `/app2/curso/${courseSlug}/${lessonSlug}`
    )
    // Se empujan los cambios al App
    this.props.onChangeCourse(courseSlug, lessonSlug)
    // Se oculta la barra de detalles
    this.setState({ sectionInFocus: 'search', index1: 0, index2: 0 })

    // Regresamos scroll
    this.searchItemsEl.scrollTop = 0
  }

  // Oculta la ventana de details se usa en mobile
  hideDetails = () => this.setState({ sectionInFocus: 'search' })

  // Se dispara cuando se hace hover
  // en CourseDetails buttonPlay o en alguna leccion
  onSetIndex2 = (index2) => {
    this.setState({ index2 })
  }

  render () {
    // console.log(this.props)
    const { index1, index2, courseInFocus, courseDetails, loadingDetails, search, sectionInFocus, interaction } = this.state
    const { tab } = this.props
    const isInputFocus = index1 === 0
    const show = tab === 'search'
    const showCourseDetails = sectionInFocus === 'courseDetails'
    return (
      <Box show={show} >
        <Panel>
          <SearchBox
            onEnter={this.onSearch}
            onArrowDown={this.onArrowDown}
            onArrowUp={this.onArrowUp}
            focus={isInputFocus && show}
          />
          <SearchItems ref={this.searchItems}>
            {search.map((item, index) => {
              const isOpen = showCourseDetails && index !== index1 - 1 && interaction === 'keyboard'
              return item.__typename === 'Course'
                ? (
                  <Course
                    onMouseOver={() => this.onMouseOver(index)}
                    onClick={() => this.onClickCourse(item, index)}
                    key={item._id}
                    isInFocus={index1 === index + 1}
                    opacity={isOpen ? '.3' : '1'}
                    blur={isOpen ? 'blur(2px)' : 'blur(0px)'}
                    {...item}
                  />
                )
                : (
                  <Lesson
                    onMouseOver={() => this.onMouseOver(index)}
                    onClick={() => this.onClickLesson(item)}
                    key={item._id}
                    isInFocus={index1 === index + 1}
                    opacity={isOpen ? '.3' : '1'}
                    blur={isOpen ? 'blur(1px)' : 'blur(0px)'}
                    {...item}
                  />
                )
            })}
          </SearchItems>
          <CourseDatails
            {...this.props}
            interaction={this.state.interaction}
            onChangeLesson={this.onChangeLesson}
            show={showCourseDetails}
            courseInFocus={courseInFocus}
            courseDetails={courseDetails}
            index2={index2}
            loadingDetails={loadingDetails}
            hideDetails={this.hideDetails}
            onPlayCourse={this.onPlayCourse}
            onSetIndex2={this.onSetIndex2}
          />
        </Panel>
      </Box>
    )
  }
}

export default withApollo(SearchComponent)
