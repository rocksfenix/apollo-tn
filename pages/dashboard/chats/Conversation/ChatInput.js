import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import { CREATE_MESSAGE, MESSAGES } from '../chat-queries'
import audios from '../../../../services/audios'

const Input = styled.textarea`
  width: 95%;
  min-height: 80%;
  padding: 5px 10px;
  background: #e9f3f5;
  border: 1px solid transparent;
  border: 1px solid #888585;
  border-radius: 3px;
  display: block;
  font-family: Roboto;
  font-size: ${p => p.size || '12px'};
  transition: .3s ease-out;
  overflow: hidden;
  outline: none;
  
  &:focus {
    border: 1px solid rgba(0, 129, 255, 1);
    border: 1px solid rgb(94, 46, 146);
    background: #FFF;
  }
`

const Panel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  background: #4285f4;
  color: #fff;
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Open Sans';
  border: 0;
  position: absolute;
  right: 1.5em;
  bottom: 1.5em;
`

class Textarea extends Component {
  onEnter = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      this.props.onEnter(e.target.value.trim())
      e.target.value = ''

      // Scroll it
      window.setTimeout(() => {
        const m = document.getElementById('dashboard-chat-messages')
        m.scrollTop = m.scrollHeight
        console.log(m.scrollTop, m.scrollHeight)
      }, 100)
    }
  }

  send = () => {
    const textarea = ReactDOM.findDOMNode(this.refs.textarea)

    if (textarea.value.trim() !== '') {
      this.props.onEnter(textarea.value.trim())
      textarea.value = ''
    }
  }

  render () {
    const { size } = this.props
    return (
      <Panel>
        <Input
          ref='textarea'
          onChange={this.onChange}
          onKeyPress={this.onEnter}
          spellCheck='false'
          size={size}
        />
        <Button onClick={this.send}>Send</Button>
      </Panel>
    )
  }
}

const InputPanel = styled.div`
  width: 100%;
  height: 15%;
  background-color: #FFF;
`

class ChatInput extends Component {
  sendMessate = async (text) => {
    const res = await this.props.client.mutate({
      mutation: CREATE_MESSAGE,
      variables: { text, receiver: this.props.receiver }
    })

    // Actualizamos cache de Apollo
    const { messages } = this.props.client.cache.readQuery({
      query: MESSAGES,
      variables: { receiver: this.props.receiver, sender: this.props.sender, skip: 0, first: 30 }
    })

    this.props.client.cache.writeQuery({
      query: MESSAGES,
      variables: { receiver: this.props.receiver, sender: this.props.sender, skip: 0, first: 30 },
      data: {
        messages: [ ...messages, res.data.messageCreate ]
      }
    })

    audios.newMessage.play()

    // Force Update
    this.props.onNewMessage([ ...messages, res.data.messageCreate ])
  }

  render () {
    return (
      <InputPanel>
        <Textarea
          onEnter={this.sendMessate}
        />
      </InputPanel>
    )
  }
}

export default withApollo(ChatInput)
