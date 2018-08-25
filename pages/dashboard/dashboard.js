import React, {Component} from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import gql from 'graphql-tag'
import Statistics from './Statistics'
import Users from './Users'
import Courses from './Courses'
import Lessons from './Lessons'
import Tickets from './Tickets'
import Chats from './Chats'
import withUser from '../../components/HOC/WithUser'

const ONLINE = gql`
  mutation {
    online
  }
`

const View = styled.section`
  height: 100vh;
  background: #000;
`

const Content = styled.div`
  width: 100%;
  height: 100vh;
  padding-left: 55px;
`

const Tabs = [
  { title: 'statistics', icon: 'icon-arm-6' },
  { title: 'users', icon: 'icon-ninja-4' },
  { title: 'courses', icon: 'icon-courses' },
  { title: 'lessons', icon: 'icon-notes' },
  { title: 'chats', icon: 'icon-help' },
  { title: 'tickets', icon: 'icon-success' }
]

const Nav = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  background-color: #1d1919;
  width: 55px;
  height: 100vh;
`

const NavItem = styled.li`
  position: relative;
  list-style: none;
  width: 100%;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${p => p.active ? '#470080' : 'transparent'};

  &:hover {
    background-color: purple;
  }

  &:hover > i {
    color: #FFF;
  }
`
const Icon = styled.i`
  color: gray;
`

const Notify = styled.div`
  position: absolute;
  right: .2em;
  top: 0.2em;
  background-color: orangered;
  border-radius: 3px;
  color: #FFF;
  font-size: 13px;
  padding: 0 .4em;
`

class DashboardPage extends Component {
  state = {
    tab: 'statistics',
    unreadChats: 0
  }

  componentDidMount () {
    // emitimos señal de conexion
    this.props.client.mutate({
      mutation: ONLINE
    })
  }

  onChangeTab = (tab) => {
    this.setState({ tab })
    Router.push(`/dashboard?tab=${tab}`)

    if (tab === 'chats') {
      this.setState({ unreadChats: 0 })
    }
  }

  onNewChat = () => {
    this.setState(state => ({
      ...state,
      unreadChats: state.unreadChats + 1
    }))
  }

  render () {
    return (
      <View>
        <Nav>
          {Tabs.map(item => (
            <NavItem
              key={item.title}
              role='navegation'
              onClick={() => this.onChangeTab(item.title)}
              active={item.title === this.state.tab}
            >
              {
                item.title === 'chats' && this.state.unreadChats
                  ? <Notify>{this.state.unreadChats}</Notify>
                  : null
              }
              <Icon className={item.icon} />
            </NavItem>
          ))}
        </Nav>
        <Content>
          <Statistics show={this.state.tab === 'statistics'} />
          <Users show={this.state.tab === 'users'} {...this.props} />
          <Courses show={this.state.tab === 'courses'} {...this.props} />
          <Lessons show={this.state.tab === 'lessons'} {...this.props} />
          <Tickets show={this.state.tab === 'tickets'} />
          <Chats show={this.state.tab === 'chats'} {...this.props} onNewChat={this.onNewChat} />
        </Content>
      </View>
    )
  }
}

export default withUser(DashboardPage)
