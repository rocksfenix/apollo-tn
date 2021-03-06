import React, {Component} from 'react'
import styled from 'styled-components'
import Mousetrap from 'mousetrap'
import { withApollo } from 'react-apollo'
import Router from 'next/router'
import Navbar from './Navbar'
import SeoHead from '../../components/SeoHead'
import themes from './themes'
import PopText from './PopText'
import Themes from './Tools/Themes'
import Bookmarks from './Tools/Bookmarks'
import Notes from './Tools/Notes'
import Snippets from './Tools/Snippets'
import Favorites from './Tools/Favorites'
import Courses from './Tools/Courses'
import Search from './Tools/Search'
import History from './History'
import TestingData from './TestingData'
import HomeApp from './HomeApp'
import Course from './Course'
import gql from 'graphql-tag'
import config from './config'
import Chat from './Chat'

const Toolbar = styled.div`
  width: 100%;
  width: 300px;
  height: 100vh;
  left: ${props => props.show ? '0;' : '-100%'};
  background-color: red;
  display: flex;
  position: fixed;
  top: 0;
  transition: all .2s cubic-bezier(1,0,0,1);
  justify-content: center;
  align-items: center;
  z-index: 600;
`

const View = styled.div`
  position: relative;
`
const COURSE = gql`
query search($slug: String!) {
  course(slug: $slug) {
    title
    slug
    _id
    cover {
      s100
    }
    color
    description
    tech
    lessons {
      title
      tech
      techVersion
      transcription
      synopsis
      slug
      _id
    }
  }
}
`

const USER_SELF = gql`{
  userSelf {
    _id
    fullname
    email
    role
    avatar {
      s100
    }
    acceptTermsAndPrivacy
  }
}
`

const ONLINE = gql`
  mutation {
    online
  }
`

class App extends Component {
  static async getInitialProps (ctx) {
    let params = { lesson: null, course: null }
    let course = null
    let user = {}
    try {
      params = ctx.req.params
      if (params.course) {
        const result = await ctx.apolloClient.query({
          query: COURSE,
          variables: { slug: params.course }
        })
        course = result.data.course
      }

      const result = await ctx.apolloClient.query({
        query: USER_SELF
      })

      user = result.data.userSelf || {}
    } catch (error) { console.log(error) }
    return {
      params,
      course,
      user
    }
  }

  state = {
    theme: themes['chemist'], // || user.preferences.theme,
    mainPanelWidth: '280px',
    contentWidth: '',
    contentLeft: '225px',
    panelSize: 'big',
    lessonActive: '',
    coursebarHeight: '100',
    setScroll: true,

    // Pocision de tool
    toolIndex: 8,

    tab: 'home',

    // Solo puede ser home o course
    // Es el contenido de la pantalla principal
    showMainContent: 'home',

    // url
    url: {
      lesson: '',
      course: ''
    },

    // datos de curso
    course: { lessons: [] },

    // Leccion en foco
    lesson: {},

    // Course DATA
    ...TestingData
  }

  componentWillMount = async () => {
    const { course } = this.props
    // console.log(course)
    if (course) {
      this.setState({
        showMainContent: 'course',
        tab: 'course',
        toolIndex: course ? 2 : 8,
        url: this.props.params,
        course,
        lesson: this.props.params.lesson
          ? course.lessons.filter(l => l.slug === this.props.params.lesson)[0]
          : course.lessons[0]
      })
    }
    // https://www.facebook.com/photo.php?fbid=10215486294212422&set=ecnf.1290584076&type=3&theater
  }

  // Agregamos el evento de cambio de navegacion
  // ver onPopState y se agregan shourtcuts
  componentDidMount () {
    if (process.browser) {
      window.addEventListener('popstate', this.onPopState)
      this.setState({
        coursebarHeight: `${window.innerHeight - 165}px`,
        contentWidth: `${window.innerWidth - 300}px`
      })
      Mousetrap.bind('h h', () => this.onChangeTab(0, 'history'))
      Mousetrap.bind('b', () => this.onChangeTab(1, 'search'))
      Mousetrap.bind('f', () => this.onChangeTab(1, 'search'))
      Mousetrap.bind('ctrl+f', (e) => {
        e.preventDefault()
        this.onChangeTab(1, 'search')
      })
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

      // emitimos se??al de conexion
      this.props.client.mutate({
        mutation: ONLINE
      })
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
      lesson: this.state.course.lessons.filter(l => l.slug === lessonSlug)[0]
    })
  }

  // Cuando se selecciona otra tab
  onChangeTab = (toolIndex, tab) => {
    if (tab === 'home') {
      this.setState({ toolIndex, tab, showMainContent: 'home' })
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
      lesson: this.state.course.lessons.filter(l => l.slug === lesson)[0]
    }))
  }

  onChangeCourse = async (course, lesson) => {
    // Actualizamos curso
    const result = await this.props.client.query({
      query: COURSE,
      variables: { slug: course }
    })

    this.setState({
      showMainContent: 'course',
      tab: 'course',
      toolIndex: 2,
      course: result.data.course,
      lesson: lesson
        ? result.data.course.lessons.filter(l => l.slug === lesson)[0]
        : result.data.course.lessons[0],
      url: {
        course,
        lesson
      }
    })
  }

  render () {
    const { tab, showMainContent } = this.state

    return (
      <View>
        <SeoHead title='Tecninja.io' />
        <PopText text={this.state.tab} />
        <Navbar
          user={this.props.user}
          {...this.state}
          activeLesson={this.state.lesson}
          onChangeTab={this.onChangeTab}
          toolIndex={this.state.toolIndex}
        />
        { showMainContent === 'course'
          ? <Course
            {...this.state}
            onChangeLesson={this.onChangeLesson}
            onLessonsSetScroll={this.onLessonsSetScroll}
          />
          : <HomeApp />
        }

        <Toolbar show={tab !== 'home' && tab !== 'course'} onMouseLeave={this.onToolsLeave}>
          <Themes show={tab === 'themes'} themes={themes} onChangeTheme={this.onChangeTheme} />
          <Bookmarks show={tab === 'boomarks'} />
          <Notes show={tab === 'notes'} />
          <Snippets show={tab === 'snippets'} />
          <Favorites show={tab === 'favorites'} />
          <Courses show={tab === 'courses'} />
          <Search show={tab === 'search'}{...this.props} onEscape={this.showPlaying} onChangeCourse={this.onChangeCourse} />
        </Toolbar>

        <History
          expanded={tab === 'history'}
          isShowTools={tab !== 'home'}
          tab={tab}
          course={this.state.course}
          lesson={this.state.lesson}
          hasCourse={this.state.course._id}
        />
        {/* <Chat {...this.props} /> */}
      </View>
    )
  }
}

export default withApollo(App)
