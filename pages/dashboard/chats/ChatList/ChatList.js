import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import { NEW_CHAT, CHATS } from '../chat-queries'
import ChatItem from './ChatItem'
import SetDisponibility from './SetDisponibility'
import audios from '../../../../services/audios'

const Panel = styled.div`

`
const Items = styled.ul`
  padding: 0;
  width: 95%;
  margin: 1em auto;
`
let sub = null

export default class extends React.Component {
  getMoreData = () => {

  }
  render () {
    const { user, conversationActive, onChatClick } = this.props

    return (
      <Query query={CHATS}>
        {({ data, loading, error, subscribeToMore }) => {
          if (loading) return null
          if (error) return null

          if (!sub && process.browser) {
            sub = subscribeToMore({
              document: NEW_CHAT,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const { newChat } = subscriptionData.data
                audios.newChat.play()

                if (prev.chats.filter(f => f._id === newChat._id).length) {
                  // TODO - Disparamos el evento de nuevo chat registrado
                  return prev
                }

                return {
                  ...prev,
                  chats: [newChat, ...prev.chats]
                }
              }
            })
          }
          return (
            <Panel>
              <SetDisponibility />
              <Items>
                {data.chats.map(chat => (
                  <ChatItem
                    isActive={conversationActive._id === chat._id}
                    key={chat._id}
                    chat={chat}
                    chats={data.chats}
                    receiver={chat._id}
                    sender={user._id}
                    onChatClick={onChatClick}
                    first={30}
                    skip={0}
                  />
                ))}
              </Items>
            </Panel>
          )
        }}
      </Query>
    )
  }
}
