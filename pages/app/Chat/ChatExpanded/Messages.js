import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Message from './Message'

export const MESSAGES = gql`
  query messages($sender: String!, $receiver: String!, $first: Int, $skip: Int) {
    messages(sender: $sender, receiver: $receiver, first: $first, skip: $skip){
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

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

const Chat = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 100%;
  width: 100%;
  position: relative;
  min-height: 0px;
`

const ChatMessages = styled.div`
  overflow-y: auto;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0.5em;
  background: transparent;

  ::-webkit-scrollbar {
      width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #FFF
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: rgb(174, 197, 208);
      border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: rgb(174, 197, 208); 
  }
`

// Extraer los despues del indice pasata hasta que el senderID cambie
// Obtener una lista de sublistas
// [ [{},{}], [{}]]
const getSegments = (messages) => {
  if (!messages.length) return []
  // debugger
  // Agregamos el primer elemento
  let currentItem = messages[0]
  let acc = [ [currentItem] ]
  let secment = 0

  for (let i = 1; i < messages.length; i++) {
    const element = messages[i]

    if (currentItem.sender === element.sender) {
      if (!acc[secment]) acc[secment] = []
      acc[secment].push(element)
    } else {
      secment++
      acc[secment] = [ element ]
      currentItem = element
    }
  }

  return acc
}

export default class extends React.Component {
  unsubscribe = null
  render () {
    if (!this.props.receiver._id || !this.props.sender._id) return null
    return (
      <Query
        query={MESSAGES}
        variables={{ receiver: this.props.receiver._id, sender: this.props.sender._id }}
      >
        {({ loading, error, data, subscribeToMore }) => {
          if (!this.unsubscribe && process.browser) {
            this.unsubscribe = subscribeToMore({
              document: NEW_MESSAGE_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const { newMessage } = subscriptionData.data

                // Scroll IT
                window.setTimeout(() => {
                  this.props.force()
                }, 30)

                // Validamos si no esta expandido para agreegar
                // Como mensajes sin leer
                if (!this.props.show) {
                  this.props.newMessageUnread(newMessage)
                }
                return {
                  ...prev,
                  messages: [ ...prev.messages, newMessage ]
                }
              }
            })
          }
          if (data.messages) {
            return (
              <Chat>
                <ChatMessages id='app-messages'>
                  {getSegments(data.messages).map((segment, i) => (
                    <Message
                      key={`sec_id${i}`}
                      segment={segment}
                      itsMe={segment[0].sender === this.props.sender._id}
                      me={this.props.sender}
                      receiver={this.props.receiver}
                    />
                  ))}
                </ChatMessages>
              </Chat>
            )
          } else {
            return null
          }
        }}
      </Query>
    )
  }
}
