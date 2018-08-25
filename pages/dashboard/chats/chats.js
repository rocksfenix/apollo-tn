import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ChatList from './ChatList/ChatList'
import Conversation from './Conversation'
import Information from './Information'
import _Panel from '../Panel'

const Panel = styled(_Panel)`
  display: flex;
  align-items: center;
  justify-content: space-around;
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
