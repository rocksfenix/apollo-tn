import React, {Component} from 'react'
import styled from 'styled-components'
import Mousetrap from 'mousetrap'
import Router from 'next/router'
import Navbar from './Navbar'
import SeoHead from '../../components/SeoHead'
import WithUser from '../../components/WithUser'
import themes from './themes'
// import PopText from './popText'
import Themes from './Tools/Themes'
import Bookmarks from './Tools/Bookmarks'
import Notes from './Tools/Notes'
import Snippets from './Tools/Snippets'
import Favorites from './Tools/Favorites'
import Courses from './Tools/Courses'
import Search from './Tools/Search'
import Coursebar from './Coursebar/Coursebar'
import History from './History'
import Content from './Content'
import HandlerSize from './HandlerSize'
import MainPanel from './MainPanel'
import TestingData from './TestingData'
// import gpl from 'graphql-tag'
// import {graphql, compose} from 'react-apollo'
// import queries from './queries'
import config from './config'

const Toolbar = styled.div`
  width: 100%;
  height: 100vh;
  left: ${props => props.show ? '0;' : '-100%'};
  display: flex;
  position: absolute;
  top: 0;
  transition: all .2s ease-in-out;
  justify-content: center;
  align-items: center;
  z-index: 600;
`

const View = styled.div`
  position: relative;
`

class App extends Component {
  state = {
    theme: themes['chemist'], // || user.preferences.theme,
    mainPanelWidth: '280px',
    contentWidth: '',
    contentLeft: '280px',
    panelSize: 'big',
    lessonActive: '',
    coursebarHeight: '100',
    setScroll: true,

    // Pocision de tool
    toolIndex: 8,

    // url
    url: {
      lesson: '',
      course: '',
      tab: 'home'
    },

    // datos de curso
    course: { lessons: [] },

    // Leccion en foco
    lesson: {},

    // Course DATA
    ...TestingData
  }

  componentWillMount = () => {
    const { course, lesson } = this.props.params
    this.setState({
      url: {
        lesson: lesson || null,
        course: course || null
      }
    })
  }

  // Agregamos el evento de cambio de navegacion
  // ver onPopState y se agregan shourtcuts
  componentDidMount () {
    if (process.browser) {
      window.addEventListener('popstate', this.onPopState)

      this.onPopState()

      this.setState({
        coursebarHeight: `${window.innerHeight - 165}px`,
        contentWidth: `${window.innerWidth - 300}px`
      })
      Mousetrap.bind('h h', () => this.onChangeTab(0, 'history'))
      Mousetrap.bind('b', () => this.onChangeTab(1, 'search'))
      Mousetrap.bind('f', () => this.onChangeTab(1, 'search'))
      Mousetrap.bind('p p', () => this.onChangeTab(2, 'curso'))
      Mousetrap.bind('c c', () => this.onChangeTab(3, 'courses'))
      // Mousetrap.bind('f f', () => this.onChangeTab('favorites'))
      Mousetrap.bind('s s', () => this.onChangeTab(5, 'snippets'))
      Mousetrap.bind('n n', () => this.onChangeTab(6, 'notes'))
      Mousetrap.bind('b m', () => this.onChangeTab(7, 'bookmarks'))
      Mousetrap.bind('t t', () => this.onChangeTab(8, 'themes'))
      Mousetrap.bind('esc', () => this.onChangeTab(2, 'curso'))
      Mousetrap.bind('ctrl+up', this.toolUp)
      Mousetrap.bind('ctrl+down', this.toolDown)

      // Si hay curso se setea

      if (this.state.course && this.state.course.lessons) {
        try {
          let slug = window.location.href.split('/')[6]
          return this.setState({
            lesson: TestingData.course.lessons.filter(l => l.slug === slug)[0]
          })
        } catch (error) {
          this.setState({
            lesson: TestingData.course.lessons[0]
          })
        }
      }
    }
  }

  // toolTown se ejecuta al precionar CTRL + ArrowDown
  // Resta el toolIndex hasta llegar la longitud de tabs
  toolDown = () => {
    const { toolIndex } = this.state
    const newIndex = toolIndex + 1
    if (toolIndex <= 8) {
      this.setState({
        toolIndex: newIndex,
        tab: config.tabs[newIndex].label
      })
    }
  }

  toolUp = () => {
    const { toolIndex } = this.state
    const newIndex = toolIndex - 1
    if (toolIndex > 0) {
      this.setState({
        toolIndex: newIndex,
        tab: config.tabs[newIndex].label
      })
    }
  }

  onLessonsSetScroll = () => this.setState({ setScroll: false })

  // Este evento se dispara cuando
  // se navega el el historial a travez
  // de las flechaz de navegacion del navegador
  onPopState = (e) => {
    // Metodo que parsea la URL para obtener
    // Sus params
    const parseUrl = (href) => {
      const s = href.split('/')
      return {
        course: s[5],
        lesson: s[6] ? s[6].replace(/(#)\w+/gm, '') : null
      }
    }

    const url = parseUrl(window.location.href)
    const lessonSlug = window.location.href.split('/')[6]

    this.setState({
      url,
      lesson: TestingData.course.lessons.filter(l => l.slug === lessonSlug)[0]
    })
  }

  // Cuando se selecciona otra tab
  onChangeTab = (toolIndex, tab) => {
    if (tab === 'home') {
      return Router.push('/app')
    }

    this.setState({ toolIndex, tab })
  }

  onToolsLeave = (e) => {
    // TODO revisar si activamos esta opcion
    if (e.clientX >= 200) {
      // this.onChangeTab('course')
    }
  }

  onChangeTheme = (theme) => this.setState({ theme: themes[theme] })

  onResize = (size, panelSize) => {
    this.setState({
      mainPanelWidth: `${size}px`,
      contentWidth: `${window.innerWidth - size - 17}px`,
      contentLeft: `${size}px`,
      panelSize
    })
  }

  showPlaying = () => {
    this.setState({ tab: 'course', toolIndex: 2 })
  }

  // Al hacer click en navegacion
  // Se usa para recargar leccion en browser
  onChangeLesson = (lesson) => {
    this.setState(state => ({
      ...state,
      url: {
        ...state.url,
        lesson
      },
      lesson: TestingData.course.lessons.filter(l => l.slug === lesson.replace(/(#)\w+/gm, ''))[0]
    }))
  }

  render () {
    let showCourse = true
    let showHistory = false
    let showTools = false
    let historyHeight = 'small'
    const { tab } = this.state

    // show toolvar if tab
    if (
      tab === 'search' ||
      tab === 'courses' ||
      tab === 'favorites' ||
      tab === 'snippets' ||
      tab === 'notes' ||
      tab === 'bookmarks' ||
      tab === 'themes' ||
      tab === 'account'
    ) {
      showTools = true
      showHistory = false
    }

    // histoy
    if (tab === 'history') {
      historyHeight = 'big'
      showHistory = true
    }

    if (showTools) {
      historyHeight = 'small'
    }

    if (tab === 'curso') {
      historyHeight = 'medium'
    }

    // hide all en tab === home
    if (tab === 'home') {
      showCourse = false
      showHistory = false
      showTools = false
    }

    return (
      <View>
        <SeoHead title='Tecninja.io' />
        {/* <PopText text={this.state.url.tab} /> */}

        <Navbar
          {...this.state}
          activeLesson={this.state.lesson}
          onChangeTab={this.onChangeTab}
          toolIndex={this.state.toolIndex}
        />
        {/* Panel principal el que prove el Resize */}
        <MainPanel width={this.state.mainPanelWidth}>
          <HandlerSize onResize={this.onResize} />
          <Toolbar show={showTools} onMouseLeave={this.onToolsLeave}>
            { tab === 'themes' ? <Themes themes={themes} onChangeTheme={this.onChangeTheme} /> : null }
            { tab === 'bookmarks' ? <Bookmarks /> : null }
            { tab === 'notes' ? <Notes /> : null }
            { tab === 'snippets' ? <Snippets /> : null }
            { tab === 'favorites' ? <Favorites /> : null }
            { tab === 'courses' ? <Courses /> : null }
            { tab === 'search' ? <Search {...this.props} onEscape={this.showPlaying} /> : null }
          </Toolbar>
          <Coursebar
            show={showCourse}
            size={this.state.panelSize}
            onChangeLesson={this.onChangeLesson}
            lessonSlug={this.state.url.lesson}
            coursebarHeight={this.state.coursebarHeight}
            setScroll={this.state.setScroll}
            onLessonsSetScroll={this.onLessonsSetScroll}
            course={this.state.course}
          />
          <History
            show={showHistory}
            height={historyHeight}
            isShowTools={showTools}
          />
        </MainPanel>
        <Content
          show={tab !== 'home'}
          width={this.state.contentWidth}
          left={this.state.contentLeft}
          lesson={this.state.lesson}
          course={this.state.course}
        />
      </View>
    )
  }
}

// export default compose(
//   graphql(queries.query.courses, {name: 'courses'})
// )(WithUser(App))

export default WithUser(App)
