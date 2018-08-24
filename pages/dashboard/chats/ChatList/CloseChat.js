import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { CLOSE_CHAT, CHATS } from './../chat-queries'

const Panel = styled.div`
  position: absolute;
  top: 17px;
  transition: all .3s ease-out;
  right: ${p => p.show ? '10px' : '-100%'};
`
const Button = styled.button`
  border: 0;
  cursor: pointer;
`
export default({ _id, show }) => (
  <Mutation
    mutation={CLOSE_CHAT}
    variables={{ _id }}
    update={(cache, { data: { closeChat } }) => {
      const { chats } = cache.readQuery({ query: CHATS })
      cache.writeQuery({
        query: CHATS,
        data: {
          chats: chats.filter(c => c._id !== closeChat._id)
        }
      })
    }}
  >
    {(closeChat, { data }) => (
      <Panel show={show}>
        <Button onClick={closeChat}>
          <i className='icon-cross' />
        </Button>
      </Panel>
    )}
  </Mutation>
)
