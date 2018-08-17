import React, {Component} from 'react'
import styled from 'styled-components'
import Messages from './messages'
import ChatInput from './ChatInput'

const Panel = styled.div`
  width: 40%;
  height: 100%;
  background-color: #FFF;
  position: relative;
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #f2f2f2;
`

class ConversarionComponent extends Component {
  render () {
    if (!this.props.conversationActive._id) return <Panel>Loading...</Panel>
    const { messages, sender, conversationActive } = this.props

    // Filtramos solo por sender y receiver activo
    // eslint-disable-next-line no-mixed-operators
    const messagesFiltered = messages.filter(m => m.sender === sender._id && m.receiver === conversationActive._id || m.sender === conversationActive._id && m.receiver === sender._id)

    return (
      <Panel>
        <Messages
          messages={messagesFiltered}
          receiver={this.props.conversationActive}
          sender={sender}
        />
        <ChatInput receiver={this.props.conversationActive._id} />
      </Panel>
    )
  }
}

export default ConversarionComponent
