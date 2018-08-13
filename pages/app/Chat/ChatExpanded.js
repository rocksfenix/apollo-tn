import React, {Component} from 'react'
import styled, { keyframes } from 'styled-components'
import { withApollo, Mutation } from 'react-apollo'
import Messages from './Messages'
import gql from 'graphql-tag'

const NEW_CHAT = gql`
  mutation newChat($agent: String!) {
    newChat (agent: $agent)
  }
`

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

const anim = keyframes`
  15% {
    opacity: 0;
    transform: scale(0);
  }

  30% {
    opacity: 1;
  }

  100% {
    opacity: 1;
    transform: scale(1);
    z-index: 2147483639;
  }
`

const ChatExpanded = styled.div`
  opacity: 1;
  z-index: -1;
  position: fixed;
  bottom: 0px;
  width: 330px;
  height: 652px;
  max-width: 100%;
  max-height: 100%;
  min-height: 0px;
  min-width: 0px;
  background-color: tomato;
  border: 0px;
  overflow: hidden;
  right: 0px;
  opacity: 0;
  bottom: 0;
  animation: ${p => p.show ? `.4s ease-out ${anim}` : ''};
  animation-fill-mode: forwards;
  transform-origin: 100% 100%;
  transform: scale(0);
`

const ChatContainer = styled.div`
  position: absolute;
  top: 0px;
  left: auto;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  will-change: opacity;
  backface-visibility: hidden;
  padding: 1em 1em 2em;
  background-color: #FFF;
  z-index: 2147483639;
`

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.2em 1em;
  overflow: hidden;
  border-radius: 10px;
  background: rgb(233, 238, 244);
`

const Button = styled.button`
  border: 0;
  outline: none;
  cursor: pointer;
`

const Icon = styled.i`
  transform: rotate(90deg);
`

const Top = styled.div`
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 2;
  background-color: rgb(255, 255, 255);
  color: rgb(66, 77, 87);
  font-size: 1em;
  height: 50px;
  flex-shrink: 0;
  -webkit-box-flex: 0;
  flex-grow: 0;
  text-align: left;
  display: flex;
  -webkit-box-align: stretch;
  align-items: stretch;
  font-weight: 700 !important;
  border-width: initial;
  border-style: initial;
  border-color: rgb(0, 0, 0);
  border-image: initial;
  padding: 0px 0.8em;
  flex-grow: 0;

  ::after {
    content: '';
    width: 88%;
    margin: 0 auto;
    border-bottom: 1px solid red;
    position: absolute;
    bottom: 0;
    border-bottom: 1px solid #e9eef4;
  }
`

const AvatarBox = styled.div`
  width: 35px;
  height: 35px;
  margin-right: 0.5em;
`

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`

const AgentInfo = styled.div`
  
`

const AgentTitle = styled.div`
  font-weight: 300;
  font-size: 0.7em;
  opacity: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
`
const AgentName = styled.div`
  font-size: 0.8em;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
`

const AgentBox = styled.div`
  display: flex;
  min-width: 0px;
  -webkit-box-align: center;
  align-items: center;
  z-index: 1;
  color: rgb(66, 77, 87);
  flex-shrink: 0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.1em 0.6em;
  position: relative;
  padding: 0.6em 0.8em;
  background: rgb(255, 255, 255);
  flex-grow: 1;
  flex-shrink: 0;
`

const ChatNow = styled.div`
  text-align: center;
  font-size: 0.9em;
  padding: 1em;
  box-sizing: border-box;
  will-change: opacity;
  backface-visibility: hidden;
`

const BigButton = styled.button`
  color: rgb(255, 255, 255);
  font-size: inherit;
  font-weight: bold;
  font-family: inherit;
  width: 100%;
  max-width: 320px;
  opacity: 1;
  text-transform: none;
  background-color: rgb(66, 127, 225);
  border-radius: 0.3em;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  padding: 0.5em;
`

const InputPanel = styled.div`
  width: 100%;
  height: 100%;
  background-color: blue;
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

class ChatExpandedComponent extends Component {
  state = {
    activeChat: false
  }

  newChat = async () => {
    const res = await this.props.client.mutate({
      mutation: NEW_CHAT,
      variables: { agent: this.props.agentAvailable._id }
    })

    // Obtener datos del agente
    if (res.data.newChat) {
      this.setState({ activeChat: true })
    }
  }

  render () {
    return (
      <ChatExpanded
        show={this.props.show}
      >
        <ChatContainer>
          <ChatBox>
            <Top>
              <Button>
                <Icon className='icon-menu-points' />
              </Button>
              <Button onClick={this.props.onClick}>
                <Icon className='icon-arrow-bottom' />
              </Button>
            </Top>
            <AgentBox>
              <AvatarBox>
                <Avatar src='/static/avatar.jpg' />
              </AvatarBox>
              <AgentInfo>
                <AgentName>Gerardo Gallegos</AgentName>
                <AgentTitle>SEO</AgentTitle>
              </AgentInfo>
            </AgentBox>
            { !this.props.agentAvailable._id || !this.props.user._id
              ? 'Auth is needed!'
              : (
                <Messages
                  receiver={this.props.agentAvailable}
                  sender={this.props.user}
                  show={this.props.show}
                />
              )
            }
            <ChatNow>
              { this.state.activeChat
                ? <Input receiver={this.props.agentAvailable} />
                : <BigButton onClick={this.newChat}>Chatear ahora</BigButton>
              }
            </ChatNow>
          </ChatBox>
        </ChatContainer>
      </ChatExpanded>
    )
  }
}

export default withApollo(ChatExpandedComponent)
