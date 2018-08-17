import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import ChatList from './ChatList'
import Conversation from './Conversation'
import Information from './Information'

import { NEW_MESSAGE_SUBSCRIPTION, NEW_CHAT } from './chat-queries'

const USER = gql`
  query user ($_id: ID!) {
    user(_id: $_id) {
      _id
      fullname
      email
      avatar {
        s100
      }
    }
  }
`

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
    lastChatId: '',
    lastMessageId: '',
    messages: [],
    messagesUnread: {},
    chats: [],
    conversationActive: { _id: '' },

    fetchUser: false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    // Cuando llega un nuevo chat
    if (nextProps.newChat.newChat && nextProps.newChat.newChat._id !== prevState.lastChatId) {
      document.getElementById('audio-incoming').play()
      return {
        ...prevState,
        lastChatId: nextProps.newChat.newChat._id,
        chats: [ ...prevState.chats, nextProps.newChat.newChat ]
      }
    }

    // Cuanto llega un nuevo mensaje
    if (nextProps.newMessage.newMessage && prevState.lastMessageId !== nextProps.newMessage.newMessage._id) {
      // Revisar si el nuevo mensaje tiene conversacion previa
      // emitida por la sub newChat si no es asi es posible que
      // el usuario haya recargado la pagina en ese caso se crea el nuevo
      // chat si que llegue a travez de la subscricion

      // Esiste sender chat con ese mensaje
      const hasChat = prevState.chats.filter(chat => chat._id === nextProps.newMessage.newMessage.sender)

      // Si no tiene chat traer los datos del servidor
      // Si es diferente al usuario admin activo
      const fetchUser = hasChat.length || nextProps.user._id === nextProps.newMessage.newMessage.sender
        ? false
        : nextProps.newMessage.newMessage.sender

      // Nuevo Mensaje
      document.getElementById('audio-pop').play()
      let messagesUnread = prevState.messagesUnread

      // Si estoy en otro usuario activo
      if (nextProps.newMessage.newMessage.sender !== prevState.conversationActive._id) {
        const {sender} = nextProps.newMessage.newMessage
        // si existe la key se añade uno
        // Si no existe se crea
        if (!messagesUnread[`user-${sender}`]) messagesUnread[`user-${sender}`] = 0

        messagesUnread[`user-${sender}`] = messagesUnread[`user-${sender}`] + 1
      }
      return {
        messages: [ ...prevState.messages, nextProps.newMessage.newMessage ],
        lastMessageId: nextProps.newMessage.newMessage._id,
        messagesUnread,
        fetchUser
      }
    }
    return null
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.lastChatId !== prevState.lastChatId) {
      this.props.onNewChat()
    }

    if (this.state.lastMessageId !== prevState.lastMessageId) {
      const msgPanel = document.getElementById('x-messages-panel')
      const messages = document.getElementById('x-messages')

      if (msgPanel && messages) {
        // animacion de scroll
        // Calculamos la differiencia, cuanto scroll vamos a mover
        const diff = messages.clientHeight - msgPanel.scrollTop
        // const diff = messages.clientHeight
        // milisecons
        let totalTime = 500
        let step = diff * 10 / totalTime

        let i = 0
        const move = () => {
          if (i < diff) {
            msgPanel.scrollTop = msgPanel.scrollTop + step
            i += step
            window.requestAnimationFrame(move)
          }
        }
        move()
      }

      // TODO hacer que se muestro tooltip con nuevos mensajes
      // this.props.onNewMessage()
    }

    if (this.state.fetchUser) {
      this.fetchUser()
    }
  }

  fetchUser = async () => {
    const res = await this.props.client.query({
      query: USER,
      variables: { _id: this.state.fetchUser }
    })

    this.setState(state => ({
      fetchUser: false,
      chats: [ ...state.chats, res.data.user ]
    }))

    document.getElementById('audio-incoming').play()

    this.props.onNewChat()
  }

  onChatClick = async (receiver) => {
    // TODO agregar mensajes previos
    // const res = await this.props.client.query({
    //   query: MESSAGES,
    //   variables: { sender: this.props.user._id, receiver: receiver._id }
    // })

    // debugger

    // limpiamos los unreads
    this.setState(state => ({
      ...state,
      messagesUnread: {
        ...state.messagesUnread,
        [`user-${receiver._id}`]: 0
      },
      conversationActive: receiver
    }))
  }

  render () {
    return (
      <Panel show={this.props.show}>
        <Chats>
          <ChatList
            chats={this.state.chats}
            onChatClick={this.onChatClick}
            conversationActive={this.state.conversationActive}
            messagesUnread={this.state.messagesUnread}
            messages={this.state.messages}
          />
        </Chats>
        <Conversation
          conversationActive={this.state.conversationActive}
          sender={this.props.user}
          messages={this.state.messages}
        />
        <Information _id={this.state.conversationActive._id} />
      </Panel>
    )
  }
}

export default compose(
  graphql(NEW_MESSAGE_SUBSCRIPTION, { name: 'newMessage' }),
  graphql(NEW_CHAT, {name: 'newChat'})
)(ChatComponent)