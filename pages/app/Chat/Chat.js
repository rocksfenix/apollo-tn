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
  mutation newChat($agent: ID!, $ticket: ID!) {
    newChat (agent: $agent, ticket: $ticket)
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

const MessagesUnread = styled.div`
  position: absolute;
  right: -10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  background-color: #ff0047;
  border-radius: 3px;
  color: #FFF;
  font-size: 13px;
  padding: 0 .4em;
  opacity: 1;
  -webkit-transform: translateY(-50%) scale(1);
  -ms-transform: translateY(-50%) scale(1);
  transform: translateY(-50%) scale(1);
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
`

class ChatComponent extends Component {
  state = {
    isExpanded: false,
    activeChat: false,
    agentAvailable: {},
    endConversation: null,
    endConversationCustomer: null,
    ticket: null,
    messagesUnread: 0,
    hasConversationActive: false
  }

  componentDidUpdate (prevProps) {
    if (this.props.onCloseConversation.closeConvesation !== prevProps.onCloseConversation.closeConvesation) {
      this.setState({ endConversation: true })
    }
  }

  expandedToggle = () => this.setState(state => ({
    ...state,
    isExpanded: !state.isExpanded,
    messagesUnread: 0
  }))

  newChat = async () => {
    if (this.state.agentAvailable._id && this.state.ticket) {
      const res = await this.props.client.mutate({
        mutation: NEW_CHAT,
        variables: {
          agent: this.state.agentAvailable._id,
          ticket: this.state.ticket
        }
      })

      // Obtener datos del agente
      if (res.data.newChat) {
        this.setState({ activeChat: true, endConversation: false })
      }
    }
  }

  onTicketCreate = (ticket) => {
    this.setState({ ticket: ticket._id })
    if (this.state.agentAvailable._id) {
      this.newChat()
    }
  }

  onAgentSync = ({ conversationTicket, agent }) => {
    // console.log(conversationTicket)
    // // debugger
    // console.log(this.state)
    if (agent) {
      this.setState({ agentAvailable: agent, ticket: conversationTicket })
    } else {
      this.setState({ agentAvailable: {}, ticket: conversationTicket })
    }

    if (conversationTicket) {
      this.newChat()
    }
  }

  onCloseEnd = () => {
    this.setState({
      isExpanded: false,
      activeChat: false,
      agentAvailable: null,
      endConversation: false,
      closeCode: '',
      hasConversationActive: false
    })
  }

  newMessageUnread = (message) => {
    this.setState(state => ({
      ...state,
      messagesUnread: state.messagesUnread + 1
    }))
  }

  // Se usa para actualizar los mensajes
  // cuando un nuevo mensaje se crea
  // a pesar de actualizar el cache de apollo
  // No se actualizaba, de esta manera se forza
  force = () => {
    this.forceUpdate()
    // Scroll IT
    const m = document.getElementById('app-messages')
    m.scrollTop = m.scrollHeight
  }

  render () {
    return (
      <Panel>
        <ChatMini
          show={!this.state.isExpanded}
          onClick={this.expandedToggle}>
          <ChatImage src='/static/chat.svg' />
          { this.state.messagesUnread > 0
            ? <MessagesUnread>{this.state.messagesUnread}</MessagesUnread>
            : null
          }
        </ChatMini>
        <ChatExpanded
          isExpanded={this.state.isExpanded}
          onMinimize={this.expandedToggle}
          onAgentSync={this.onAgentSync}
          onTicketCreate={this.onTicketCreate}
          newChat={this.newChat}
          onCloseEnd={this.onCloseEnd}
          newMessageUnread={this.newMessageUnread}
          force={this.force}
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
