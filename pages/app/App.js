import React, {Component} from 'react'
import styled from 'styled-components'
import Mousetrap from 'mousetrap'
import Navbar from './Navbar'
import SeoHead from '../../components/SeoHead'
import WithUser from '../../components/WithUser'
import themes from './themes'
import PopText from './popText'
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

const Toolbar = styled.div`
  width: 100%;
  height: 100vh;
left: ${props => props.show ? '0' : '-100%'};
  display: flex;
  position: absolute;
  top: 0;
  transition: all .3s ease-in-out;
  justify-content: center;
  align-items: center;
  z-index: 600;
  /* box-shadow: 0 0 97px 10px rgba(0,0,0,0.6); */
  overflow: hidden;
`

const View = styled.div`
  overflow-x: hidden;
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

    // Course DATA
    ...TestingData
  }

  // Se setea la tab por defecto
  componentWillMount = () => {
    if (!this.props.params.tab) {
      this.state.params = {
        tab: 'home',
        lessonActive: ''
      }
    } else {
      this.state.params = this.props.params
    }
  }

  // Agregamos el evento de cambio de navegacion
  // ver onPopState y se agregan shourtcuts
  componentDidMount () {
    if (process.browser) {
      window.addEventListener('popstate', this.onPopState)

      this.onPopState()

      if (process.browser) {
        this.setState({
          coursebarHeight: `${window.innerHeight - 165}px`,
          contentWidth: `${window.innerWidth - 280}px`
        })
        Mousetrap.bind('h h', () => this.onChangeTab('history'))
        Mousetrap.bind('b b', () => this.onChangeTab('search'))
        Mousetrap.bind('c c', () => this.onChangeTab('courses'))
        Mousetrap.bind('p p', () => this.onChangeTab('player'))
        Mousetrap.bind('f f', () => this.onChangeTab('favorites'))
        Mousetrap.bind('s s', () => this.onChangeTab('snippets'))
        Mousetrap.bind('n n', () => this.onChangeTab('notes'))
        Mousetrap.bind('b m', () => this.onChangeTab('bookmarks'))
        Mousetrap.bind('t t', () => this.onChangeTab('themes'))
        Mousetrap.bind('esc', () => this.onChangeTab('player'))
      }
    }
  }

  onLessonsSetScroll = () => this.setState({ setScroll: false })

  // Metodo que parsea la URL para obtener
  // Sus params
  parseUrl = (href) => {
    const s = href.split('/')
    return {
      tab: s[4],
      courseSlug: s[5],
      lessonSlug: s[6],
      l3: s[7]
    }
  }

  // Este evento se dispara cuando
  // se navega el el historial a travez
  // de las flechaz de navegacion del navegador
  onPopState = (e) => {
    const params = this.parseUrl(window.location.href)
    this.setState({ params })
  }

  // Cuando se selecciona otra tab
  onChangeTab = (tab) => {
    this.setState(state => ({
      ...state,
      params: { ...state.params, tab }
    }))
  }

  onToolsLeave = (e) => {
    // TODO revisar si activamos esta opcion
    if (e.clientX >= 200) {
      // this.onChangeTab('player')
    }
  }

  onChangeTheme = (theme) => this.setState({ theme: themes[theme] })

  onResize = (size, panelSize) => {
    this.setState({
      mainPanelWidth: `${size}px`,
      contentWidth: `${window.innerWidth - size}px`,
      contentLeft: `${size}px`,
      panelSize
    })
  }

  // Al hacer click en navegacion
  // Se usa para recargar leccion en browser
  onChangeLesson = (lessonSlug) => {
    this.setState(state => ({
      ...state,
      params: {
        ...state.params,
        lessonSlug
      }
    }))
  }

  render () {
    let showCourse = true
    let showHistory = true
    let showTools = false
    let historyHeight = 'small'

    const { tab } = this.state.params

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
    }

    // histoy
    if (tab === 'history') {
      historyHeight = 'big'
      showHistory = true
    }

    if (showTools) {
      historyHeight = 'small'
    }

    if (tab === 'player') {
      historyHeight = 'medium'
    }

    // hide all en tab === home
    if (tab === 'home') {
      showCourse = false
      showHistory = false
      showTools = false
    }

    /*
     El MainPanel es el que prove el Resize
     * Se muestra (left) cuando el CourseBar o el Toolbar esta abierto
    */

    return (
      <View>
        <SeoHead title='Dashboard Tecninja.io' />
        <PopText text={this.state.params.tab} />
        <Navbar
          {...this.state}
          onChangeTab={this.onChangeTab}
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
            { tab === 'search' ? <Search /> : null }
          </Toolbar>
          <Coursebar
            show={showCourse}
            size={this.state.panelSize}
            onChangeLesson={this.onChangeLesson}
            lessonActive={this.state.params.lessonSlug}
            coursebarHeight={this.state.coursebarHeight}
            setScroll={this.state.setScroll}
            onLessonsSetScroll={this.onLessonsSetScroll}
            course={this.state.course}
          />
          <History show={showHistory} height={historyHeight} />
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

export default WithUser(App)
