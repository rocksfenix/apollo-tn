import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { MESSAGES } from '../../../dashboard/chats/chat-queries'
import gql from 'graphql-tag'

const CREATE_MESSAGE = gql`
  mutation messageCreate($text: String!, $receiver: ID!) {
    messageCreate(text: $text, receiver: $receiver) {
      _id
      text
      sender
      receiver
      createdAt
    }
  }
`

const InputPanel = styled.div`
  width: 100%;
  height: 100%;
  background-color: blue;
`

export default ({ receiver, sender }) => {
  let input
  return (
    <Mutation
      mutation={CREATE_MESSAGE}
      update={(cache, { data: { messageCreate } }) => {
        const variables = { sender: sender._id, receiver: receiver._id }
        const { messages } = cache.readQuery({ query: MESSAGES, variables })
        cache.writeQuery({
          query: MESSAGES,
          variables,
          data: { messages: messages.concat([messageCreate]) }
        })
      }}
    >
      {(createMessage, { data }) => (
        <InputPanel>
          <form
            onSubmit={e => {
              e.preventDefault()
              createMessage({ variables: { text: input.value, receiver: receiver._id } })
              input.value = ''
            }}
          >
            <input
              ref={node => { input = node }}
            />
            <button type='submit'>Add Message</button>
          </form>
        </InputPanel>
      )}
    </Mutation>
  )
}
