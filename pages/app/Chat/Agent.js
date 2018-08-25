import React from 'react'
import styled from 'styled-components'

const AvatarBox = styled.div`
  width: ${props => props.size || '35px'};
  height: ${props => props.size || '35px'};
  position: relative;
`
const AvatarBall = styled.div`
  background-color: ${p => p.isConnected ? '#32d412' : '#c6c6c6'};
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid #FFF;
  position: absolute;
  top: 2px;
  right: -3px;
  box-shadow: -6px 3px 10px rgba(0, 0, 0, 0.61);
`

const AvatarImage = styled.div`
  width: ${props => props.size || '35px'};
  height: ${props => props.size || '35px'};
  border-radius: 50%;
  background: url(${props => props.src});
  background-size: cover;
`

const AgentInfo = styled.div`
  margin-left: .5em;
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
  padding: 0.3em 0.8em;
  background: rgb(255, 255, 255);
  flex-grow: 1;
  flex-shrink: 0;
`

const Avatar = ({ src, isConnected }) => (
  <AvatarBox>
    <AvatarImage src={src} />
    <AvatarBall isConnected={isConnected} />
  </AvatarBox>
)

export default ({_id, avatar, fullname, isConnected}) => {
  if (!_id) return null
  return (
    <AgentBox>
      <AvatarBox>
        <Avatar src={avatar.s100} isConnected={isConnected} />
      </AvatarBox>
      <AgentInfo>
        <AgentName>{ fullname }</AgentName>
        <AgentTitle>Support Agent</AgentTitle>
      </AgentInfo>
    </AgentBox>
  )
}
