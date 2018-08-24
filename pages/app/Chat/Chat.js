import React, {Component} from 'react'
import styled from 'styled-components'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ChatExpanded from './ChatExpanded'

const ON_CLOSE_CONVERSATION = gql`
  subscription {
    closeConvesation {
      code
    }
  }
`

const NEW_CHAT = gql`
  mutation newChat($agent: String!) {
    newChat (agent: $agent)
  }
`

const Panel = styled.div`
  opacity: 1;
  visibility: visible;
  z-index: 2518398688;
  position: fixed;
  bottom: 0px;
  width: 84px;
  height: 84px;
  max-width: 100%;
  max-height: 100%;
  min-height: 0px;
  min-width: 0px;
  background-color: transparent;
  border: 0px;
  overflow: hidden;
  right: 0px;
  transition: none 0s ease 0s !important;
`

const ChatMini = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0.2em 0.8em;
  position: relative;
  color: rgb(0, 0, 0);
  border-radius: 50%;
  background: rgb(255, 255, 255);
  position: absolute;
  bottom: ${p => p.show ? '1em' : '-15%'};
  right: 1em;
  transform: ${p => p.show ? 'rotate(0deg)' : 'rotate(90deg)'};
  opacity: ${p => p.show ? '1' : '0'};
  transition: .3s ease-in-out;
  transform-origin: 100% 120%;
  z-index: 1000;
`

const ChatImage = styled.img`
  width: 28px;
  height: 28px;
`

class ChatComponent extends Component {
  state = {
    isExpanded: false,
    activeChat: false,
    agentAvailable: null,
    endConversation: null,
    endConversationCustomer: null,
    hasTicket: false
  }

  componentDidUpdate (prevProps) {
    if (this.props.onCloseConversation.closeConvesation !== prevProps.onCloseConversation.closeConvesation) {
      this.setState({ endConversation: true })
    }
  }

  expandedToggle = () => this.setState(state => ({
    ...state,
    isExpanded: !state.isExpanded
  }))

  newChat = async () => {
    const res = await this.props.client.mutate({
      mutation: NEW_CHAT,
      variables: { agent: this.state.agentAvailable._id }
    })

    // Obtener datos del agente
    if (res.data.newChat) {
      this.setState({ activeChat: true, endConversation: false })
    }
  }

  onTicketCreate = () => {
    this.setState({ hasTicket: true })
    this.newChat()
  }

  onAgentSync = (agentAvailable) => {
    this.setState({ agentAvailable })
  }

  onCloseEnd = () => {
    this.setState({
      isExpanded: false,
      activeChat: false,
      agentAvailable: null,
      endConversation: false,
      closeCode: '',
      hasTicket: false
    })
  }

  render () {
    return (
      <Panel>
        <ChatMini
          show={!this.state.isExpanded}
          onClick={this.expandedToggle}>
          <ChatImage src='/static/chat.svg' />
        </ChatMini>
        <ChatExpanded
          show={this.state.isExpanded}
          onMinimize={this.expandedToggle}
          onAgentSync={this.onAgentSync}
          onTicketCreate={this.onTicketCreate}
          newChat={this.newChat}
          onCloseEnd={this.onCloseEnd}
          {...this.props}
          {...this.state}
        />
      </Panel>
    )
  }
}

export default compose(
  graphql(ON_CLOSE_CONVERSATION, { name: 'onCloseConversation' })
)(ChatComponent)
