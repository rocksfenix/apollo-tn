import React, {Component} from 'react'
import styled, { keyframes } from 'styled-components'
import { withApollo } from 'react-apollo'
import Messages from './Messages'
import EndConversation from './EndConversation'
import ChatInput from './ChatInput'
import OpenChat from './OpenChat'
import Agent from '../Agent'

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

const Panel = styled.div`
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
  background-color: transparent;
  border: 0px;
  overflow: hidden;
  right: 0px;
  opacity: 0;
  bottom: 0;
  will-change: opacity, transform;
  animation: ${p => p.show ? `.4s ease-out ${anim}` : ''};
  animation-fill-mode: forwards;
  will-change: transform, opacity;
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
  z-index: 2147483639;
`

const ChatBox = styled.div`
  display: ${p => p.show ? 'flex' : 'none'};
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

const ChatNow = styled.div`
  text-align: center;
  font-size: 0.9em;
  box-sizing: border-box;
  will-change: opacity;
  backface-visibility: hidden;
  box-shadow: rgba(0, 0, 0, 0.03) 0px -1em 1em;
`

class ChatExpandedComponent extends Component {
  render () {
    const { isExpanded, endConversation, hasTicket, agentAvailable, user, hasConversationActive } = this.props
    return (
      <Panel
        show={isExpanded}
      >
        { endConversation
          ? <EndConversation {...this.props} />
          : (
            <ChatContainer>
              <OpenChat
                mount={!hasTicket && isExpanded && !hasConversationActive}
                {...this.props}
              />
              <ChatBox show={isExpanded && (hasTicket || hasConversationActive) && agentAvailable._id}>
                <Top>
                  <Button>
                    <Icon className='icon-menu-points' />
                  </Button>
                  <Button onClick={this.props.onMinimize}>
                    <Icon className='icon-arrow-bottom' />
                  </Button>
                </Top>
                <Agent {...agentAvailable} />
                { !agentAvailable._id || !user._id
                  ? 'Auth is needed!'
                  : (
                    <Messages
                      receiver={agentAvailable}
                      sender={user}
                      show={isExpanded}
                      newMessageUnread={this.props.newMessageUnread}
                      force={this.props.force}
                    />
                  )
                }
                <ChatNow>
                  <ChatInput receiver={agentAvailable} sender={user} force={this.props.force} />
                </ChatNow>
              </ChatBox>
            </ChatContainer>
          )
        }
      </Panel>
    )
  }
}

export default withApollo(ChatExpandedComponent)
