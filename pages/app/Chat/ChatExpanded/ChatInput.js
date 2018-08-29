import React, {Component} from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import { MESSAGES } from '../../../dashboard/Chats/chat-queries'
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
  background-color: #FFF;
`

const Container = styled.div`
  width: 100%;
  height: 10%;
  padding: 1em;
  display: flex;
`

const Textarea = styled.textarea`
  border: 0;
  outline: none;
  flex-grow: 1;
`

const ButtonSend = styled.button`
  border: 0;
  cursor: pointer;
  outline: none;

  :hover {
    color: blue;
  }
`

const Icon = styled.i`
  font-size: 25px;
`

class ChatImput extends Component {
  state = { text: '' }
  componentDidMount () {
    this.textarea = ReactDom.findDOMNode(this.refs.textarea)
  }

  onChange = (e) => {
    this.setState({ text: e.target.value })
  }

  onKeyUp = (e) => {
    if (e.key === 'Enter') {
      e.target.value = ''
      this.setState({ text: '' })
    }
  }

  sendMessage = async (e) => {
    if (e.key === 'Enter') {
      e.target.value = ''
      this.send()
    }
  }

  send = async () => {
    if (this.state.text.trim() !== '') {
      const { receiver, sender } = this.props
      const res = await this.props.client.mutate({
        mutation: CREATE_MESSAGE,
        variables: { text: this.state.text.trim(), receiver: receiver._id }
      })
      const variables = { sender: sender._id, receiver: receiver._id }

      const { messages } = this.props.client.cache.readQuery({ query: MESSAGES, variables })

      this.props.client.cache.writeQuery({
        query: MESSAGES,
        variables,
        data: { messages: messages.concat([res.data.messageCreate]) }
      })

      // Se forza la actualizacion de el padre
      this.props.force()
      this.setState({ text: '' })
    }
  }

  render () {
    return (
      <InputPanel>
        <Container>
          <Textarea
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            ref='textarea'
            value={this.state.text}
            onChange={this.onChange}
            onKeyPress={this.sendMessage}
            onKeyUp={this.onKeyUp}
            // placeholder='cows are green'
          />
          <ButtonSend type='submit' onClick={this.send}>
            <Icon className='icon-send-line' />
          </ButtonSend>
        </Container>
      </InputPanel>

    )
  }
}

export default withApollo(ChatImput)
