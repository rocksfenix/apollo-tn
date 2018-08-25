import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import Agent from '../../Agent'

export const NEW_TICKET = gql`
  mutation ticketCreate (
      $text: String!
      $customer: ID!
      $priority: String
      $status: String
      $category: String
    ) {
    ticketCreate(input: {
      text: $text
      customer: $customer
      priority: $priority
      status: $status
      category: $category
    }) {
      _id
      text
      category
      status
      priority
      author {
        fullname
        avatar {
          s100
        }
      }
      customer {
        fullname
        avatar {
          s100
        }
      }
    }
  }
`

const Panel = styled.div`
  width: 100%;
  height: 100%;
  background-color: #FFF;
  display: flex;
  flex-direction: column;
`

const Icon = styled.i`
`

const Top = styled.div`
  width: 95%;
  margin: 0 auto;
  height: 35px;
  background-color: #FFF;
  position: relative;
  border-bottom: 1px solid #f4f4f4;
`

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  width: 100%;
  height: 30%;
  background-color: #FFF;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  width: 100%;
  height: 70%;
  position: relative;
  display: flex;
  flex-direction: column;
`

const OnlineBox = styled.div`
  width: 100%;
  flex-grow: 1;
`

const OnlineMessage = styled.div`
  padding: 1em 1em 0;
`

const BackBar = styled.div`
  width: 100%;
  height: 30px;
  background-color: #cbd1e7;
  flex-grow: 0;
`

class Online extends Component {
  state = { text: '' }

  componentDidMount () {
    this.textIt(this.props.text)
  }

  componentDidUpdate (nextProps) {
    if (nextProps.text !== this.props.text) {
      this.textIt(this.props.text)
    }
  }

  textIt = (text) => {
    let i = 0
    let t = ''
    const tick = window.setInterval(() => {
      if (text.length === i + 1) {
        window.clearInterval(tick)
        this.props.onEndTyping()
      }
      t += text[i]
      i++
      this.setState({ text: t })
    }, 30)
  }

  render () {
    return (
      <OnlineBox>
        <Agent {...this.props} />
        <OnlineMessage>
          {this.state.text}
        </OnlineMessage>
      </OnlineBox>
    )
  }
}

class OffLine extends Component {
  state = { text: '' }

  componentDidMount () {
    this.textIt(this.props.text)
  }

  componentDidUpdate (nextProps) {
    if (nextProps.text !== this.props.text) {
      this.textIt(this.props.text)
    }
  }

  textIt = (text) => {
    let i = 0
    let t = ''
    const tick = window.setInterval(() => {
      if (text.length === i + 1) {
        window.clearInterval(tick)
        this.props.onEndTyping()
      }
      t += text[i]
      i++
      this.setState({ text: t })
    }, 30)
  }

  render () {
    return (
      <OnlineBox>
        <OnlineMessage>
          {this.state.text}
        </OnlineMessage>
      </OnlineBox>
    )
  }
}

const Contents = styled.div`
  height: 100%;
  width: 400%;
  display: flex;
  position: absolute;
  top: 0;
  transition-property: left;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(1,0,0,1);
  background-color: #cbd1e7;
  will-change: left;
`

const ContentBox = styled.div`
  position: relative;
  background-color: #FFF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  will-change: transform, opacity;
  transition: transform .5s ease-out, opacity .5s ease-out; 
  transform: ${p => p.active ? 'translateY(0)' : 'translateY(30%)'};
  opacity: ${p => p.active ? '1' : '0'};
  z-index: ${p => p.active ? '100' : '-1'};
`

const Optio = styled.div`
  background-color: #FFF;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background .1s ease-out;

  :hover {
    background-color: #d8d8e8;
  }
`

class Option extends Component {
  onChange = () => {
    this.props.onChange(this.props.keyName, this.props.value)
  }
  render () {
    return (
      <Optio onClick={this.onChange}>
        { this.props.label }
      </Optio>
    )
  }
}

const Textarea = styled.textarea`
  min-height: 200px;
  margin: 1em auto;
  width: 95%;
  padding: .4em;
  outline: none;

  :focus {
    border: 1px solid purple;
  }
`

const animationBtn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const ButtonListo = styled.button`
  width: 85%;
  margin: 0 auto;
  border: 0;
  background-color: #9e68cf;
  color: #FFF;
  display: ${p => p.active ? 'block' : 'none'};
  animation: .4s ease-out ${animationBtn};
  cursor: pointer;
  padding: .5em;
  border-radius: 5px;
`

const ButtonMinimize = styled.button`
  border: 0;
  outline: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 3px;
`

class OpenTicketComponent extends Component {
  //
  stepsOnline = [
    {
      text: 'Hola Ninja, me podrias decir con que tienes problemas?',
      left: '0%'
    },
    {
      text: 'Okis, por favor describeme el problema',
      left: '-100%'
    },
    {
      text: 'Exelente, que prioridad tiene?',
      left: '-200%'
    }
  ]

  stepsOffline = [
    {
      text: 'De momento no hay agentes, pero puedes abrir un ticket, con que hay problema?',
      left: '0%'
    },
    {
      text: 'Okis, por favor describeme el problema',
      left: '-100%'
    },
    {
      text: 'Exelente, que prioridad tiene?',
      left: '-200%'
    },
    {
      text: 'Tu ticket ya fue creado, daremos seguimiento y te contactaremos a la brevedad!',
      left: '-300%'
    }
  ]

  options = {
    category: [
      { label: 'Con los Pagos', value: 'billing' },
      { label: 'Enconte un Bugg', value: 'bugg' },
      { label: 'Con el contenido', value: 'content' },
      { label: 'Con lo Legal', value: 'legal' },
      { label: 'Otro', value: 'other' }
    ],

    priority: [
      { label: 'Baja', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'Urgente', value: 'urgent' }
    ]
  }

  state = {
    step: 0,
    showOptions: '',
    ticket: {
      category: 'other',
      priority: 'normal',
      text: ''
    }
  }

  componentDidMount () {
    this.textarea = ReactDOM.findDOMNode(this.refs.textarea)
  }

  onChange = (key, value) => {
    if (key === 'category') {
      this.setState(state => ({
        ...state,
        step: 1,
        ticket: {
          ...state.ticket,
          [key]: value
        }
      }))
    }

    // if (key === 'text') {
    //   this.setState({ step: 2 })
    // }

    if (key === 'priority') {
      this.state.ticket.priority = value
      if (this.props.agentAvailable._id) {
        // Si esta online
        this.createTicket()
      } else {
        // si es offline
        this.setState({ step: 3 })
      }
    }
  }

  onChanteText = (e) => {
    this.state.ticket.text = e.target.value
    // this.setState()
    this.forceUpdate()
  }

  onCheckText = () => {
    if (this.state.ticket.text !== '') {
      this.setState({ step: 2 })
    } else {
      window.alert('Por favor describe brevemente el problema')
    }
  }

  // Se dispara cuando finaliza la escritura
  // de la instruccion
  onEndTyping = () => {
    const { step } = this.state
    if (step === 0) this.setState({ showOptions: 'category' })
    if (step === 1) {
      this.setState({ showOptions: 'text' })
      this.textarea.focus()
    }
    if (step === 2) this.setState({ showOptions: 'priority' })

    if (step === 3) this.setState({ showOptions: 'endTicket' })
  }

  createTicket = async () => {
    const res = await this.props.client.mutate({
      mutation: NEW_TICKET,
      variables: {
        ...this.state.ticket,
        customer: this.props.user._id
      }
    })

    if (res.data.ticketCreate) {
      this.props.onTicketCreate()
    }
  }

  render () {
    const { agentAvailable } = this.props
    const { showOptions } = this.state
    const step = agentAvailable._id
      ? this.stepsOnline[this.state.step]
      : this.stepsOffline[this.state.step]

    return (
      <Panel>
        <Top>
          <ButtonMinimize onClick={this.props.onMinimize}>
            <Icon className='icon-arrow-bottom' />
          </ButtonMinimize>
        </Top>
        <Main>
          <Header>
            {
              agentAvailable._id
                ? <Online
                  {...agentAvailable}
                  text={step.text}
                  onEndTyping={this.onEndTyping}
                />
                : <OffLine
                  {...agentAvailable}
                  text={step.text}
                  onEndTyping={this.onEndTyping}
                />
            }
            <BackBar />
          </Header>
          <Content>
            <Contents style={{ left: step.left }}>
              <ContentBox active={showOptions === 'category'}>
                {this.options.category.map(opt => (
                  <Option
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    onChange={this.onChange}
                    keyName='category'
                  />
                ))}
              </ContentBox>
              <ContentBox active={showOptions === 'text'}>
                <Textarea ref='textarea' onChange={this.onChanteText} />
                <ButtonListo active={this.state.ticket.text.length > 10} onClick={() => this.onCheckText('text', 'other.....')}>Confirmar</ButtonListo>
              </ContentBox>
              <ContentBox active={showOptions === 'priority'}>
                {this.options.priority.map(opt => (
                  <Option
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    onChange={this.onChange}
                    keyName='priority'
                  />
                ))}
              </ContentBox>
              <ContentBox active={showOptions === 'endTicket'}>
                <button onClick={this.props.onMinimize}>Cerrar</button>
              </ContentBox>
            </Contents>
          </Content>
        </Main>
      </Panel>
    )
  }
}

export default withApollo(OpenTicketComponent)
