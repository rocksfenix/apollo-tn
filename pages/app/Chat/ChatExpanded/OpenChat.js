import React, {Component} from 'react'
import styled, { keyframes } from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import OpenTicket from './OpenTicket'

const GET_AGENT_AVAILABLE = gql`{
  agentAvailable {
    _id
    fullname
    # position
    avatar {
      s100
    }
  }
}
`

const anim = keyframes`
  15% {
    opacity: 0;
    transform: scale(.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    z-index: 2147483639;
  }
`

const Panel = styled.div`
  animation: .3s ease-out ${anim};
  display: flex;
  flex-direction: column;
  min-width: 0px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.2em 1em;
  overflow: hidden;
  border-radius: 10px;
  background: rgb(233, 238, 244);
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const Main = styled.div`
  width: 100%;
  height: 100%;
  background-color: orange;
`

class OpenChat extends Component {
  state = {
    loading: true,
    needFetch: false,
    agentAvailable: null
  }

  async componentDidUpdate (prevProps) {
    if (this.props.mount && this.props.mount !== prevProps.mount) {
      this.getAvailableAgent()
    }
  }

  getAvailableAgent = async () => {
    this.setState({ loading: true })
    const res = await this.props.client.query({
      query: GET_AGENT_AVAILABLE,
      fetchPolicy: 'network-only',
      ssr: false
    })

    // TODO - Eliminar el setimeout
    window.setTimeout(() => {
      if (res.data.agentAvailable) {
        this.setState({ agentAvailable: res.data.agentAvailable, loading: false })

        this.props.onAgentSync(res.data.agentAvailable)
      } else {
        this.setState({ loading: false })
      }
    }, 1000)
  }

  render () {
    if (!this.props.mount) return null
    return (
      <Panel>

        { this.state.loading ? <h1>Loading...</h1>
          : (
            <Main>
              <OpenTicket
                agentAvailable={this.state.agentAvailable}
                onMinimize={this.props.onMinimize}
                user={this.props.user}
                onTicketCreate={this.props.onTicketCreate}
              />
            </Main>
          )
        }

      </Panel>
    )
  }
}

export default withApollo(OpenChat)
