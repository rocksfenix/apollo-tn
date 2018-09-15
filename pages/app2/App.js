import React, {Component} from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import { withApollo } from 'react-apollo'
import ReactSwipeEvents from 'react-swipe-events'
// import OutsideClickHandler from 'react-outside-click-handler'
import { COURSE, ONLINE } from './queries'
import getData from './lib/getData'
import sc from './lib/shourtcuts'
import { themes } from './config'
import Navegation from './Navegation'
import Home from './Home'
import History from './History'
import Course from './Course'
import Search from './Search'
import SeoHead from '../../components/SeoHead'
import Snippets from './Snippets'

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
    theme: themes['fire'], // || user.preferences.theme

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
    // mainContent: 'home',

    setScroll: false,
    course: {},
    lesson: {},
    courseSlug: null,
    lessonSlug: null
  }

  componentWillMount = async () => {
    const { course, params } = this.props
    const { courseSlug, lessonSlug } = params
    const tab = courseSlug ? 'course' : 'home'
    const mainContent = courseSlug ? 'course' : 'home'

    this.setState({
      mainContent,
      tab,
      course,
      // lesson,
      courseSlug,
      lessonSlug
    })
  }

  // Agregamos el evento de cambio de navegacion
  // ver onPopState y se agregan shourtcuts
  async componentDidMount () {
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
      lessonSlug,
      showMobileNav: false,
      tab: 'course'
    }))
  }

  onChangeCourse = async (courseSlug, lessonSlug) => {
    // Actualizamos curso
    const res = await this.props.client.query({
      query: COURSE,
      variables: { slug: courseSlug }
    })

    this.setState({
      tab: 'course',
      toolIndex: 2,
      showMobileNav: false,
      courseSlug,
      lessonSlug,
      course: res.data.course
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

  hideSidebar = () => {
    this.setState({ tab: this.state.mainContent })
  }

  render () {
    const { isMobile, tab, course, showMobileNav, lessonSlug } = this.state

    console.log(this.state)

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
          { course && tab !== 'home'
            ? <Course
              {...this.state}
              course={course}
              lessonSlug={lessonSlug}
              onChangeLesson={this.onChangeLesson}
              onLessonsSetScroll={this.onLessonsSetScroll}
              onSetColorMode={this.onSetColorMode}
              onSetAutoplay={this.onSetAutoplay}
              hideSidebar={this.hideSidebar}
            />
            : <Home {...this.state} /> }
          {/* Se muestra en desktop, o en mobile si esta en showMobileNav */}
          <Navegation
            {...this.state}
            show={!isMobile || showMobileNav}
            course={course}
            user={this.props.user}
            onChangeTab={this.onChangeTab}
            activeTab={tab}
          />

          <Toolbar show={showTools} >
            <Search
              tab={tab}
              isMobile={isMobile}
              onChangeLesson={this.onChangeLesson}
              onChangeCourse={this.onChangeCourse}
            />
            <Snippets
              tab={tab}
            />
          </Toolbar>

          <History
            show={showTools || tab === 'history' || (tab === 'course' && course)}
            isMobile={isMobile}
            tab={tab}
            showMobileNav={showMobileNav}
            lessonSlug={lessonSlug}
            course={course}
            hideSidebar={this.hideSidebar}
            onChangeCourse={this.onChangeCourse}
          />
        </Panel>

      </ReactSwipeEvents>
    )
  }
}

export default withApollo(App)
