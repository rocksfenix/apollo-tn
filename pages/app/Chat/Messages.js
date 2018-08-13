import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Message from './Message'

const MESSAGES = gql`
  query messages($sender: String!, $receiver: String!) {
    messages(sender: $sender, receiver: $receiver){
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

let unsubscribe = null

export default (props) => {
  if (!props.receiver._id || !props.sender._id || !props.show) return null

  return (
    <Query
      query={MESSAGES}
      variables={{ receiver: props.receiver._id, sender: props.sender._id }}
    >
      {({ loading, error, data, subscribeToMore }) => {
        if (!unsubscribe) {
          unsubscribe = subscribeToMore({
            document: NEW_MESSAGE_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev
              const { newMessage } = subscriptionData.data
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
              <ChatMessages>
                {getSegments(data.messages).map((segment, i) => (
                  <Message
                    key={`sec_id${i}`}
                    segment={segment}
                    itsMe={segment[0].sender === props.sender._id}
                    me={props.sender}
                    receiver={props.receiver}
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
