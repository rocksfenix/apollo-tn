import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ChatList from './ChatList/ChatList'
import Conversation from './Conversation'
import Information from './Information'

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-right: 52px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  transition: all .2s ease-in-out;
  overflow: hidden;
  opacity: ${p => p.show ? '1' : '0'};
  transform: ${p => p.show ? 'scale(1)' : 'scale(.93)'};
  z-index: ${p => p.show ? '1000' : '-1'};
`

const Chats = styled.div`
  width: 25%;
  height: 100%;
  background-color: #FFF;
`

class ChatComponent extends Component {
  static propTypes = {
    // Cuando llega una nueva conversacion
    onNewChat: PropTypes.func,

    // Cuando llega un nuevo mensaje
    onNewMessage: PropTypes.func
  }

  state = {
    conversationActive: {},
    messages: []
  }

  child = React.createRef()

  onChatClick = (conversationActive, messages) => this.setState(state => ({
    conversationActive,
    messages
  }))

  onNewMessage = (messages) => this.setState({ messages })
  render () {
    return (
      <Panel show={this.props.show}>
        <Chats>
          <ChatList
            {...this.props}
            onChatClick={this.onChatClick}
            conversationActive={this.state.conversationActive}
          />
        </Chats>
        <Conversation
          conversationActive={this.state.conversationActive}
          sender={this.props.user}
          messages={this.state.messages}
          onNewMessage={this.onNewMessage}
        />
        <Information _id={this.state.conversationActive._id} />
      </Panel>
    )
  }
}

export default ChatComponent
