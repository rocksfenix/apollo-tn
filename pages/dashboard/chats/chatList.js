import React from 'react'
import styled from 'styled-components'
import ToggleField from '../../../components/ToggleField'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SET_DISPONIBILITY = gql`
  mutation availability ($connection: Boolean!) {
    availability(connection: $connection)
  }
`

const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`

const Item = styled.li`
  list-style: none;
  padding: .3em .5em;
  background-color: ${p => p.active ? 'yellow' : '#FFF'};
  position: relative;
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

export default ({ chats, onChatClick, conversationActive, messagesUnread }) => (
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
    <ul>
      {chats.map((chat, i) => (
        <Item
          key={chat._id}
          onClick={() => onChatClick(chat)}
          active={conversationActive._id === chat._id}
        ><Avatar src={chat.avatar.s100} />
          {chat.fullname}
          <Notify
            show={messagesUnread[`user-${chat._id}`] !== 0}
          >{ messagesUnread[`user-${chat._id}`] }</Notify>
        </Item>
      ))}
    </ul>
  </div>
)
