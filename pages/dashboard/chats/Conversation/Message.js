import React from 'react'
import styled, {keyframes} from 'styled-components'
import moment from 'moment'

const Anima = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`

const Message = styled.div`
  display: flex;
  margin-bottom: 1em;
  flex-direction: ${p => p.itsMe ? 'row-reverse' : 'row'};
`

const Author = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  text-align: center;
  font-size: 0.7em;
  line-height: 1.6em;
  min-width: 20px;
  -webkit-box-flex: 0;
  flex-grow: 0;
  margin: 0px 0.3em 0px 0px;
`
const AuthorAvatar = styled.div`
  text-align: center;
  background-color: rgb(255, 255, 255);
  text-transform: uppercase;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
`
const AuthorImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border-radius: inherit;
`

const MessageData = styled.div`
  -webkit-box-flex: 1;
  flex-grow: 1;
  max-width: 100%;
  flex-shrink: 1;
  overflow: hidden;
`

const MessageX = styled.div`
  display: block;
`

const Box = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: ${p => p.itsMe ? 'flex-end' : 'flex-start'};
  font-size: 0.9em;
  max-width: 100%;
  flex-direction: row;
  opacity: 1;
  color: rgb(66, 77, 87);
  margin: 0.3em;
`

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${p => p.itsMe ? 'flex-end' : 'flex-start'};
  overflow: hidden;
`

const NameBox = styled.div`
  text-align: ${p => p.itsMe ? 'right' : 'left'};
  width: 200%;
  font-size: 10px;
  margin: 0 .5em;
`

const Text = styled.div`
  display: inline-block;
  max-width: 100%;
  margin-bottom: 0.1em;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px;
  color: rgb(66, 77, 87);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  border-radius: ${p => p.active ? '20px 0 20px 20px' : '0 20px 20px 20px'};
  background: ${p => p.active ? 'linear-gradient(20deg,#283c97,rgba(0,129,255,1))' : '#f2f3f4'};
  color: ${p => p.active ? '#FFF' : '#000'};
  animation: .3s ease-out ${Anima};
`
// background: ${p => p.active ? '#4a5ec3' : '#f2f3f4'};
//     background: linear-gradient(20deg, #4a5ec3, #85bbe4);

// background: linear-gradient(20deg, #283a90, #7b9de2);

const MessageText = styled.div`
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  padding: 1em;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  font-size: 12px;
`

export default ({ segment, itsMe, receiver, me }) => (
  <Message itsMe={itsMe}>
    <Author>
      <AuthorAvatar>
        <AuthorImage
          src={itsMe ? me.avatar.s100 : receiver.avatar.s100}
        />
      </AuthorAvatar>
    </Author>
    <MessageData>
      <MessageX>
        {segment.map((message, index) => (
          <Box key={message._id} itsMe={itsMe}>
            <Wrap itsMe={itsMe}>
              { index === 0
                ? (
                  <NameBox itsMe={itsMe}>
                    {itsMe ? me.fullname : receiver.fullname} {moment(message.createdAt).format('LT')}
                  </NameBox>
                )
                : null
              }
              <Text active={itsMe}>
                <MessageText>{message.text}</MessageText>
              </Text>
            </Wrap>
          </Box>
        ))}
      </MessageX>
    </MessageData>
  </Message>
)
