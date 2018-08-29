import React, {Component} from 'react'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import { MESSAGES, NEW_MESSAGE_SUBSCRIPTION } from './../chat-queries'
import SmallText from './SmallText'
import CloseChat from './CloseChat'
import PubSub from 'pubsub-js'
import audios from '../../../../services/audios'

const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`

const Item = styled.li`
  list-style: none;
  padding: .3em .5em;
  background-color: ${p => p.active ? '#2a2b32' : '#FFF'};
  color: ${p => p.active ? '#FFF' : '#000'};
  position: relative;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  cursor: pointer;
  overflow: hidden;
`

const Notify = styled.div`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ff0047;
  border-radius: 3px;
  color: #FFF;
  font-size: 13px;
  padding: 0 .4em;
  opacity: ${p => p.show ? '1' : '0'};
  transform: ${p => p.show ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0)'};
  transition: all .3s ease-in-out;
`

const AvatarBox = styled.div`
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const UserData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 1em;
`

const Username = styled.div`
  width: 100%;
  font-size: 16px;
`

const LastMessage = styled.div`
  width: 100%;
  height: 22px;
  overflow: hidden;
  position: relative;
`

class ChatItem extends Component {
  state = {
    unread: 0,
    lastMessage: '',
    showClose: false,
    skip: 30,
    loadMore: false
  }

  onChatClick = () => {
    this.setState({ unread: 0 })
    const { chat, userMessages } = this.props
    this.props.onChatClick(chat, userMessages.messages)
  }

  emmit = (chat, messages) => {
    if (this.props.isActive) {
      this.props.onChatClick(chat, messages)
    }
  }

  componentDidMount () {
    const { chat } = this.props

    this.createMessageSubscription = this.props.userMessages.subscribeToMore({
      document: NEW_MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev
        const { newMessage } = subscriptionData.data

        audios.newMessage.play()

        // Scroll IT
        window.setTimeout(() => {
          const m = document.getElementById('dashboard-chat-messages')
          m.scrollTop = m.scrollHeight
        }, 100)

        if (newMessage.sender !== chat._id) {
          return {
            ...prev,
            messages: prev.messages
          }
        }

        // Si no esta activo se agrega como mensaje sin leer
        if (!this.props.isActive) {
          this.setState(({ unread }) => ({ unread: unread + 1, lastMessage: newMessage.text }))
        }

        const newMessagesState = [...prev.messages, newMessage]

        // Si esta activo se actualiza con cada nuevo mensaje
        this.emmit(chat, newMessagesState)

        return {
          ...prev,
          messages: newMessagesState
        }
      },

      onError: (err) => console.error(err)
    })

    // create a function to subscribe to topics
    PubSub.subscribe('MY TOPIC', (msg, { _id }) => {
      // console.log(msg, data)
      if (_id === this.props.receiver) {
        console.log('LOADING ', this.props.receiver)
        this.loadMore()
      }
    })
  }

  hideClose = () => this.setState({ showClose: false })
  showClose = () => this.setState({ showClose: true })

  loadMore = () => {
    // console.log(this.props.userMessages)
    this.props.userMessages.fetchMore({
      variables: {
        skip: this.state.skip
      },
      updateQuery: (prevMessages, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevMessages
        // debugger
        if (!fetchMoreResult.messages.length) return prevMessages
        // debugger
        const newState = [ ...fetchMoreResult.messages, ...prevMessages.messages ]

        console.log(fetchMoreResult)

        this.setState(({ skip }) => ({ skip: skip + 30 }))
        this.emmit(this.props.chat, newState)
        return {
          ...prevMessages,
          messages: newState
        }
      }
    })
  }

  render () {
    const { chat, isActive } = this.props
    return (
      <Item onClick={this.onChatClick} active={isActive} onMouseOver={this.showClose} onMouseLeave={this.hideClose}>
        <AvatarBox>
          <Avatar src={chat.avatar.s100} />
        </AvatarBox>
        <UserData>
          <Username>{chat.fullname} - {chat._id}</Username>
          <LastMessage>
            { !isActive
              ? <SmallText text={this.state.lastMessage} />
              : ''
            }
          </LastMessage>
        </UserData>
        <Notify
          show={this.state.unread !== 0 && !isActive}
        >
          { this.state.unread }
        </Notify>
        <CloseChat
          show={this.state.showClose}
          _id={chat._id}
        />
      </Item>
    )
  }
}

export default graphql(MESSAGES, { name: 'userMessages' })(ChatItem)
