import React, {Component} from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import Messages from './messages'
import { CREATE_MESSAGE } from './chat-queries'

const ChatActive = styled.div`
  width: 100%;
  height: 80%;
  background-color: #e5eaf0;
`

const InputPanel = styled.div`
  width: 100%;
  height: 20%;
  background-color: #FFF;
`

const Input = ({ receiver }) => {
  let input
  return (
    <Mutation mutation={CREATE_MESSAGE}>
      {(createMessage, { data }) => (
        <InputPanel>
          <form
            onSubmit={e => {
              e.preventDefault()
              console.log(input.value, receiver)
              createMessage({ variables: { text: input.value, receiver } })
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

class ConversarionComponent extends Component {
  render () {
    if (!this.props.conversationActive._id) return <div>You don't have conversations yet!</div>
    const { messages, sender, conversationActive } = this.props

    // Filtramos solo por sender y receiver activo
    // eslint-disable-next-line no-mixed-operators
    const messagesFiltered = messages.filter(m => m.sender === sender._id && m.receiver === conversationActive._id || m.sender === conversationActive._id && m.receiver === sender._id)

    return (
      <ChatActive>
        <Messages
          messages={messagesFiltered}
          receiver={this.props.conversationActive}
          sender={sender}
        />
        <Input receiver={this.props.conversationActive._id} />
      </ChatActive>
    )
  }
}

export default ConversarionComponent
