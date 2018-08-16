import React from 'react'
import styled from 'styled-components'
import findLast from 'lodash/findLast'
import { Mutation } from 'react-apollo'
import ToggleField from '../../../../components/ToggleField'
import { SET_DISPONIBILITY } from './../chat-queries'
import SmallText from './SmallText'

const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`

const Item = styled.li`
  list-style: none;
  padding: .3em .5em;
  background-color: ${p => p.active ? '#2a2b32' : '#FFF'};
  color: ${p => p.active ? '#FFF' : '#000'};
  position: relative;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  cursor: pointer;
`

const Notify = styled.div`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  background-color: orangered;
  border-radius: 3px;
  color: #FFF;
  font-size: 13px;
  padding: 0 .4em;
  opacity: ${p => p.show ? '1' : '0'};
  transform: ${p => p.show ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0)'};
  transition: all .3s ease-in-out;
`

const AvatarBox = styled.div`
  width: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const UserData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 1em;
`

const Items = styled.ul`
  padding: 0;
  width: 95%;
  margin: 1em auto;
`

const Username = styled.div`
  width: 100%;
  font-size: 16px;
`

const LastMessage = styled.div`
  width: 100%;
  height: 22px;
  overflow: hidden;
  position: relative;
`

const getLastPreviewMessage = (messages, userId) => {
  try {
    // Retornamos el ultimo mensaje
    return findLast(messages, m => m.sender === userId).text.substring(0, 50)
  } catch (error) {
    return ''
  }
}

export default ({ chats, onChatClick, conversationActive, messages, messagesUnread }) => {
  return (
    <div>
      <Mutation mutation={SET_DISPONIBILITY}>
        {(availability, { data }) => {
          return (
            <ToggleField
              active
              onChange={(k, value) => availability({ variables: { connection: value } })}
              label='Availability'
            />
          )
        }}
      </Mutation>
      <Items>
        {chats.map((chat, i) => (
          <Item
            key={chat._id}
            onClick={() => onChatClick(chat)}
            active={conversationActive._id === chat._id}
          >
            <AvatarBox>
              <Avatar src={chat.avatar.s100} />
            </AvatarBox>

            <UserData>
              <Username>{chat.fullname}</Username>
              <LastMessage>
                { conversationActive._id !== chat._id
                  ? <SmallText text={getLastPreviewMessage(messages, chat._id)} />
                  : ''
                }
              </LastMessage>
            </UserData>
            <Notify
              show={messagesUnread[`user-${chat._id}`] !== 0}
            >{ messagesUnread[`user-${chat._id}`] }</Notify>
          </Item>
        ))}
      </Items>
    </div>
  )
}
