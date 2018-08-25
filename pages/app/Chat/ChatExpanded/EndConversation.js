import React, {Component} from 'react'
import styled, { keyframes } from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

const FEEDBACK = gql`
  mutation feedback ($ticket: ID!, $agent: ID!, $like: Boolean!) {
    ticketFeedback(ticket: $ticket, agent: $agent, like: $like) {
      _id
    }
  }
`

const anim = keyframes`
  15% {
    opacity: 0;
    transform: scale(.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
    z-index: 2147483639;
  }
`

const Button = styled.div`
  width: 85%;
  height: 50px;
  background-color: #6e4adb;
  border-radius: 3px;
  border: 0;
  color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Panel = styled.div`
  animation: .3s ease-out ${anim};
  display: flex;
  flex-direction: column;
  min-width: 0px;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.2em 1em;
  overflow: hidden;
  border-radius: 10px;
  background: rgb(233, 238, 244);
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const ButtonLike = styled.button`
  border: 0;
  border-radius: 3px;
  background-color: #FFF;
  padding: .5em 1em;
  cursor: pointer;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1em 0;
`

const Feedback = styled.div`
  display: ${p => p.show ? 'block' : 'none'};
`

const Regards = styled.div`
  font-size: 24px;
  display: ${p => p.show ? 'block' : 'none'};
`

class EndConversation extends Component {
  state = { wasFeedbacked: false }
  feedback = async (like) => {
    const fb = await this.props.client.mutate({
      mutation: FEEDBACK,
      variables: { like, agent: this.props.agentAvailable._id, ticket: this.props.ticket }
    })

    this.setState({ wasFeedbacked: true })
    console.log(like, fb.data)
  }
  render () {
    return (
      <Panel>
        <Feedback show={!this.state.wasFeedbacked}>
          <div>Gracias por ser Ninja</div>
          <div>Que opinas del soporte?</div>
          <Buttons>
            <ButtonLike onClick={() => this.feedback(true)}>Like</ButtonLike>
            <ButtonLike onClick={() => this.feedback(false)}>Dislike</ButtonLike>
          </Buttons>
        </Feedback>
        <Regards show={this.state.wasFeedbacked}>
          Gracias Ninja!
        </Regards>
        <Button onClick={this.props.onCloseEnd}>Cerrar Chat</Button>
        <Button onClick={this.props.newChat}>Chatear de Nuevo</Button>
      </Panel>
    )
  }
}

export default withApollo(EndConversation)
