import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import SeoHead from '../../components/SeoHead'
import { getCookie, signin } from '../../lib/session'
import { redirect } from '../../lib/redirect'
import MiniLink from '../../components/MiniLink'
import SubmitButton from '../../components/SubmitButton'
import Input from '../../components/Input'
import Constants from '../../config'
import Loading from '../../components/Loading'
import SerializeForm from '../../components/HOC/SerializeForm'

const { JWT_KEY } = Constants

// TODO si no podemos implementar prevent force brute, hacer un recaptcah invisible

const LOGIN = gql`
  mutation login($email: String! $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`
const Box = styled.div`
  margin: 1em auto;
  max-width: 368px;
  padding: .5em;
  position: relative;
  user-select: none;
  box-sizing: content-box;
`

// const Center = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

const Img = styled.img`
  width: 100%;
  padding: .5em;
  display: block;
  margin: 0 auto;
`

const InfoText = styled.div`
  width: 100%;
  color: #616161;
  text-align: center;
  font-weight: 200;
  font-size: 17px;
  padding: .2em 0;
  background: linear-gradient(90deg, #00b6ff, #c300ff);
  color: #FFF;
`

class Login extends Component {
  static getInitialProps (ctx) {
    if (getCookie(JWT_KEY, ctx.req)) redirect('/', ctx)
    return {}
  }

  onResponse = ({ login = {} }) => {
    if (!login.token) {
      return window.alert('Email o Contraseña son Invalidos')
    }
    if (login.token) {
      signin(login.token, login.refreshToken)
    }
  }

  // verifyCallback = (reCaptchaResponse) => {
  //   console.log(reCaptchaResponse)
  //   this.setState({ reCaptchaResponse })
  // }

  submit = (login) => {
    const error = this.props.checkValidations()
    if (error) return window.alert(error)

    login({ variables: this.props.data })
  }

  render () {
    const paymentProcess = this.props.paymentProcess === 'true' ? '?paymentProcess=true' : ''

    return (
      <Mutation
        mutation={LOGIN}
        onCompleted={this.onResponse}
      >
        {(login, { data, loading, error }) => (
          <Box>
            <SeoHead title='Registrate en Tecninja.io' />
            <Img src='/static/tecninja-logo.svg' />
            <InfoText>Iniciar Session</InfoText>
            <Loading show={loading} />
            { error ? <h1>Error</h1> : null }
            <Input
              label='Email'
              field='email'
              type='email'
              value={this.props.data.email}
              pattern={/[^@]+@[^@]+\.[a-zA-Z]{2,}/g}
              onChange={this.props.onChange}
              onValidate={this.props.onValidate}
            />
            <Input
              label='Contraseña'
              field='password'
              minLength={6}
              value={this.props.data.password}
              type='password'
              onChange={this.props.onChange}
              onValidate={this.props.onValidate}
              onEnter={() => { this.submit(login) }}
            />
            <SubmitButton onClick={() => { this.submit(login) }} active={this.props.allValid()}>Login</SubmitButton>
            <MiniLink href={`/forgot${paymentProcess}`}>Olvide mi contraseña</MiniLink>
            <MiniLink href={`/registro${paymentProcess}`}>¿No tienes cuenta? Registrate aqui!</MiniLink>
          </Box>
        )}

      </Mutation>
    )
  }
}

export default SerializeForm([
  { field: 'email', message: 'Ingresa un Email Valido' },
  { field: 'password', message: 'Ingresa la Contraseña minimo 6 Caracteres' }
], Login)
