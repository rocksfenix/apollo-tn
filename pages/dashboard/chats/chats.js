import React, {Component} from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import ChatList from './chatList'
import Conversation from './Conversation'

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

// const MESSAGES = gql`
//   # Obtener el perfil de chat de cada usuario
//   # Obtener perfil de chat
//   # receiver
//   query messages($sender: String!, $receiver: String!) {
//     messages(sender: $sender, receiver: $receiver){
//       _id
//       text
//       sender
//       receiver
//       createdAt
//     }
//   }
// `

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
  transition: all .3s ease-in-out;
  overflow: hidden;
  opacity: ${p => p.show ? '1' : '0'};
  transform: ${p => p.show ? 'scale(1)' : 'scale(.8)'};
  z-index: ${p => p.show ? '1000' : '-1'};
`

const Chats = styled.div`
  width: 25%;
  height: 100%;
  background-color: #FFF;
`

const ChatActive = styled.div`
  width: 40%;
  height: 100%;
  background-color: pink;
`
const ChatDetails = styled.div`
  width: 35%;
  height: 100%;
  background-color: yellow;
`

class ChatComponent extends Component {
  state = {
    lastMessageId: '',
    messages: [],
    messagesUnread: {}
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.newMessageSubs.newMessage && prevState.lastMessageId !== nextProps.newMessageSubs.newMessage._id) {
      const audio = document.getElementById('audio-pop')
      audio.play()
      let messagesUnread = prevState.messagesUnread

      // Si estoy en otro usuario activo
      if (nextProps.newMessageSubs.newMessage.sender !== nextProps.conversationActive._id) {
        const {sender} = nextProps.newMessageSubs.newMessage
        // si existe la key se añade uno
        // Si no existe se crea
        if (!messagesUnread[`user-${sender}`]) {
          messagesUnread[`user-${sender}`] = 0
        }

        messagesUnread[`user-${sender}`] = messagesUnread[`user-${sender}`] + 1
      }
      return {
        messages: [ ...prevState.messages, nextProps.newMessageSubs.newMessage ],
        lastMessageId: nextProps.newMessageSubs.newMessage._id,

        messagesUnread
      }
    }
    return null
  }

  onChatClick = async (receiver) => {
    // TODO agregar mensajes previos
    // const res = await this.props.client.query({
    //   query: MESSAGES,
    //   variables: { sender: this.props.user._id, receiver: receiver._id }
    // })

    // limpiamos los unreads
    this.setState(state => ({
      ...state,
      messagesUnread: {
        ...state.messagesUnread,
        [`user-${receiver._id}`]: 0
      }
    }))

    this.props.onChatClick(receiver)
  }

  render () {
    return (
      <Panel show={this.props.show}>
        <Chats>
          <ChatList
            chats={this.props.chats}
            onChatClick={this.onChatClick}
            conversationActive={this.props.conversationActive}
            messagesUnread={this.state.messagesUnread}
          />
        </Chats>
        <ChatActive>
          <Conversation
            conversationActive={this.props.conversationActive}
            sender={this.props.user}
            messages={this.state.messages}
          />
        </ChatActive>
        <ChatDetails>
          <button onClick={() => console.log(this.state)}>DEBUGG</button>
        </ChatDetails>
      </Panel>
    )
  }
}

export default compose(
  graphql(NEW_MESSAGE_SUBSCRIPTION, { name: 'newMessageSubs' })
)(ChatComponent)
