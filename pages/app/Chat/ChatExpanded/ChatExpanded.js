import React, {Component} from 'react'
import styled, { keyframes } from 'styled-components'
import { withApollo } from 'react-apollo'
import Messages from './Messages'
import EndConversation from './EndConversation'
import ChatInput from './ChatInput'
import OpenChat from './OpenChat'

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

class ChatExpandedComponent extends Component {
  render () {
    console.log(this.props)
    const { show, endConversation, hasTicket, agentAvailable, user } = this.props
    return (
      <Panel
        show={show}
      >
        { endConversation
          ? <EndConversation {...this.props} />
          : (
            <ChatContainer>
              <OpenChat
                mount={!hasTicket && show}
                {...this.props}
              />

              { show && hasTicket && agentAvailable
                ? (
                  <ChatBox>
                    <Top>
                      <Button>
                        <Icon className='icon-menu-points' />
                      </Button>
                      <Button onClick={this.props.onMinimize}>
                        <Icon className='icon-arrow-bottom' />
                      </Button>
                    </Top>
                    <AgentBox>
                      <AvatarBox>
                        <Avatar src={agentAvailable.avatar.s100} />
                      </AvatarBox>
                      <AgentInfo>
                        <AgentName>{ agentAvailable.fullname }</AgentName>
                        <AgentTitle>Support Agent</AgentTitle>
                      </AgentInfo>
                    </AgentBox>
                    { !agentAvailable._id || !user._id
                      ? 'Auth is needed!'
                      : (
                        <Messages
                          receiver={agentAvailable}
                          sender={user}
                          show={show}
                        />
                      )
                    }
                    <ChatNow>
                      <ChatInput receiver={agentAvailable} sender={user} />
                    </ChatNow>
                  </ChatBox>
                )
                : null
              }
            </ChatContainer>
          )
        }
      </Panel>
    )
  }
}

export default withApollo(ChatExpandedComponent)
