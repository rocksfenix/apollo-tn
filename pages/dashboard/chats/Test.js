import React from 'react'
import gql from 'graphql-tag'
import { Subscription } from 'react-apollo'
// import styled from 'styled-components'

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

let access = []

export default () => (
  <Subscription
    subscription={NEW_MESSAGE_SUBSCRIPTION}
  >
    {({ data, loading, error }) => {
      if (error) { console.log(error) }
      if (data) { console.log('data', data) }
      if (data) access.push(data.newMessage)
      return (
        <div>
          <h1>SUBSCRIPTION {data}</h1>
        </div>
      )
    }}
  </Subscription>
)
