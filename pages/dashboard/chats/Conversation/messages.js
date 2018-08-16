import React from 'react'
import styled from 'styled-components'
import Message from './Message'

const Chat = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 85%;
  width: 100%;
  position: relative;
  min-height: 0px;
`

const ChatMessages = styled.div`
  overflow-y: auto;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0.5em;
  background: transparent;
  /* width */
  ::-webkit-scrollbar {
      width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #FFF
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #ecebf1;
      border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: #b30000; 
  }
`

// Extraer los despues del indice pasata hasta que el senderID cambie
// Obtener una lista de sublistas
// [ [{},{}], [{}]]
const getSegments = (messages) => {
  if (!messages.length) return []
  // debugger
  // Agregamos el primer elemento
  let currentItem = messages[0]
  let acc = [ [currentItem] ]
  let secment = 0

  for (let i = 1; i < messages.length; i++) {
    const element = messages[i]

    if (currentItem.sender === element.sender) {
      if (!acc[secment]) acc[secment] = []
      acc[secment].push(element)
    } else {
      secment++
      acc[secment] = [ element ]
      currentItem = element
    }
  }

  return acc
}

export default (props) => (
  <Chat>
    <ChatMessages id='x-messages-panel'>
      <div id='x-messages'>
        {getSegments(props.messages).map((segment, i) => (
          <Message
            key={`sec_id${i}`}
            segment={segment}
            itsMe={segment[0].sender === props.sender._id}
            me={props.sender}
            receiver={props.receiver}
          />
        ))}
      </div>
    </ChatMessages>
  </Chat>
)
