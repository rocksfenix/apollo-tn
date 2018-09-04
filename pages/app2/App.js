import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import { COURSE, ONLINE } from './queries'
import getData from './lib/getData'
import sc from './lib/shourtcuts'
import { themes } from './config'
import ReactSwipeEvents from 'react-swipe-events'
import Navegation from './Navegation'
import Router from 'next/router'
import SeoHead from '../../components/SeoHead'
import Home from './Home'
import History from './History'
import Course from './Course'
import Search from './Search'

const Panel = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`

const Toolbar = styled.div`
  width: 100%;
  width: 355px;
  height: 100vh;
  transform: ${props => props.show ? 'translateX(0%);' : 'translateX(-100%)'};
  display: flex;
  position: fixed;
  top: 0;
  transition: transform .2s cubic-bezier(1,0,0,1);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  will-change: transform;

  @media (max-width:900px) {
    width: 100%;
  }
`

class App extends Component {
  static async getInitialProps (ctx) {
    return getData(ctx)
  }

  state = {
    theme: themes['chemist'], // || user.preferences.theme

    // Dark or Light
    colorMode: 'light',

    // Si es true se ponde en play el video y se
    // reproduce la siguiente leccion automaticamente
    autoplay: false,

    // Tab activa por defecto es home
    // cambia si hay curso activo
    tab: 'home',

    // Modo de visualizacion mobile o Desktop
    device: 'desktop',

    // Por defecto es desktop
    isMobile: false,

    // Contenido principal, course o home
    mainContent: 'home',

    // Satos de curso
    course: { lessons: [] },

    // Leccion en foco
    lesson: {},

    setScroll: false
  }

  componentWillMount = async () => {
    const { course } = this.props
    if (course) {
      this.setState({
        mainContent: 'course',
        tab: 'course',
        course,
        lesson: this.props.params.lesson
          ? course.lessons.filter(l => l.slug === this.props.params.lesson)[0]
          : course.lessons[0]
      })
    }
  }

  // Agregamos el evento de cambio de navegacion
  // ver onPopState y se agregan shourtcuts
  componentDidMount () {
    if (process.browser) {
      window.addEventListener('popstate', this.onPopState)

      // Inicializamos los shourcuts
      // Recibe por segundo parametro
      // un objeto con la configuracion
      sc(this, undefined)

      // Emitimos señal de conexion
      this.props.client.mutate({ mutation: ONLINE })
      if (process.browser) {
        // configura el device en base al
        // tamaño de viewport
        if (window.innerWidth <= 900) {
          this.setState({ device: 'mobile', isMobile: true })
        }
      }
    }
  }

  find = () => this.setState({ tab: 'search' })

  toolUp = () => {
    console.log('UP')
  }

  toolDown = () => {
    console.log('DOWN')
  }

  // Cuando se selecciona otra tab
  onChangeTab = (tab) => {
    if (tab === 'home') {
      this.setState({ tab, mainContent: 'home' })
      return Router.push('/app2')
    }

    if (tab === 'course') {
      this.setState({ tab, mainContent: 'course' })
    }

    this.setState({ tab })
  }

  // Se dispara con el gesto touch hacia left
  // Oculta la barra de navegaicon en mobil
  goLeft = () => this.setState({ showMobileNav: true })

  // Se dispara con el gesto touch hacia right
  // Muestra la barra de navegaicon en mobil
  goRight = () => this.setState({ showMobileNav: false })

  // Al hacer click en navegacion
  // Se usa para recargar leccion en browser
  onChangeLesson = (lessonSlug) => {
    this.setState(state => ({
      ...state,
      lesson: this.state.course.lessons.filter(l => l.slug === lessonSlug)[0],
      showMobileNav: false,
      tab: 'course'
    }))
  }

  onChangeCourse = async (courseSlug, lessonSlug) => {
    // Actualizamos curso
    const result = await this.props.client.query({
      query: COURSE,
      variables: { slug: courseSlug }
    })

    this.setState({
      showMainContent: 'course',
      tab: 'course',
      toolIndex: 2,
      showMobileNav: false,
      course: result.data.course,
      lesson: lessonSlug
        ? result.data.course.lessons.filter(l => l.slug === lessonSlug)[0]
        : result.data.course.lessons[0],
      url: {
        courseSlug,
        lessonSlug
      }
    })
  }

  onLessonsSetScroll = () => this.setState({ setScroll: false })

  onSetColorMode = () => {
    const colorMode = this.state.colorMode === 'light' ? 'dark' : 'light'
    this.setState({ colorMode })
  }

  onSetAutoplay = () => {
    this.setState(state => ({
      ...state,
      autoplay: !state.autoplay
    }))
  }

  render () {
    const { course, mainContent, isMobile, tab, lesson, showMobileNav } = this.state

    // show tools si tab es diferente de course y home
    let showTools = false

    if (!isMobile) {
      showTools = tab !== 'home' && tab !== 'course'
    }

    if (isMobile) {
      showTools = tab !== 'home' && tab !== 'course' && showMobileNav
    }

    return (
      <ReactSwipeEvents
        onSwipedLeft={this.goRight}
        onSwipedRight={this.goLeft}
        threshold={showMobileNav ? 110 : 80}
      >
        <Panel>
          <SeoHead title='Tecninja.io' />

          {/* Se muestra en desktop, o en mobile si esta en showMobileNav */}
          <Navegation
            show={!isMobile || showMobileNav}
            course={course}
            user={this.props.user}
            {...this.state}
            activeLesson={lesson}
            onChangeTab={this.onChangeTab}
            activeTab={tab}
          />

          {/* ===================== El contenido principal ===================== */}
          {
            mainContent === 'course' && course._id
              ? <Course
                {...this.state}
                onChangeLesson={this.onChangeLesson}
                onLessonsSetScroll={this.onLessonsSetScroll}
                onSetColorMode={this.onSetColorMode}
                onSetAutoplay={this.onSetAutoplay}
              />
              : <Home {...this.state} />
          }

          {/* ==========  Las tools solo si es diferente al content ============ */}
          <Toolbar show={showTools} >
            <Search tab={tab} isMobile={isMobile} onChangeLesson={this.onChangeLesson} onChangeCourse={this.onChangeCourse} />
          </Toolbar>

          {/* ================== Si esta seleccionado se expande =============== */}
          <History
            show={showTools || tab === 'history' || (tab === 'course' && course._id)}
            isMobile={isMobile}
            playing={course._id}
            tab={tab}
            showMobileNav={showMobileNav}
          />

        </Panel>
      </ReactSwipeEvents>
    )
  }
}

export default withApollo(App)
