import React, {Component} from 'react'
import styled from 'styled-components'
import Router from 'next/router'

const View = styled.section`
  /* padding-left: 55px; */
  height: 100vh;
`

const Content = styled.div`
  width: 10%;
  padding-left: 55px;
`

const Tabs = [
  { title: 'statistics', icon: 'icon-arm-6' },
  { title: 'users', icon: 'icon-ninja-4' },
  { title: 'courses', icon: 'icon-courses' },
  { title: 'lessons', icon: 'icon-notes' },
  { title: 'issues', icon: 'icon-success' }
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

class DashboardPage extends Component {
  state = {
    tab: 'statistics'
  }

  onChangeTab = (tab) => {
    this.setState({ tab })
    Router.push(`/dashboard?tab=${tab}`)
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
              <Icon className={item.icon} />
            </NavItem>
          ))}
        </Nav>
        <Content>
          <h1>Dashboard</h1>
        </Content>
      </View>
    )
  }
}

export default DashboardPage
