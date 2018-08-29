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
  display: flex;
`

const Content = styled.div`
  flex-grow: 1;
  height: 100vh;
  position: relative;
`

const Tabs = [
  { title: 'statistics', icon: 'icon-statistics-2' },
  { title: 'users', icon: 'icon-ninja-2-line' },
  { title: 'courses', icon: 'icon-courses' },
  { title: 'lessons', icon: 'icon-lesson' },
  { title: 'chats', icon: 'icon-chat' },
  { title: 'tickets', icon: 'icon-ticket' }
]

const Nav = styled.nav`
  position: relative;
  z-index: 10000;
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
  transition: background .3s ease-out;

  :hover > i {
    color: #FFF;
  }
`

const Icon = styled.i`
  color: ${p => p.active ? '#FFF' : '#6f6f6f'};
  font-size: 24px;
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
const Option = ({ item, onChangeTab, notification, count, active }) => (
  <NavItem
    key={item.title}
    role='navegation'
    onClick={() => onChangeTab(item.title)}
    active={active}
  >
    {
      notification
        ? <Notify>{count}</Notify>
        : null
    }
    <Icon
      className={item.icon}
      active={active}
    />
  </NavItem>
)

class DashboardPage extends Component {
  state = {
    tab: 'statistics',
    unreadChats: 0,
    unReadTickets: 0
  }

  componentWillMount () {
    this.setState({ tab: this.props.query.tab })
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

  onNewTicket = () => {
    this.setState(state => ({
      ...state,
      unReadTickets: state.unReadTickets + 1
    }))
  }

  render () {
    return (
      <View>
        <Nav>
          {Tabs.map(item => (
            <Option
              key={item.title}
              item={item}
              onChangeTab={this.onChangeTab}
              notification={item.title === 'tickets' && this.state.unReadTickets}
              count={this.state.unReadTickets}
              active={item.title === this.state.tab}
            />
          ))}
        </Nav>
        <Content>
          <Statistics show={this.state.tab === 'statistics'} />
          <Users show={this.state.tab === 'users'} {...this.props} />
          <Courses show={this.state.tab === 'courses'} {...this.props} />
          <Lessons show={this.state.tab === 'lessons'} {...this.props} />
          <Tickets show={this.state.tab === 'tickets'} onNewTicket={this.onNewTicket} />
          <Chats show={this.state.tab === 'chats'} {...this.props} onNewChat={this.onNewChat} />
        </Content>
      </View>
    )
  }
}

export default withUser(DashboardPage)
