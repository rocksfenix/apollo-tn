import React, {Component} from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Recaptcha from 'react-recaptcha'
import styled from 'styled-components'
import SeoHead from '../../components/SeoHead'
import Input from '../../components/Input'
import MiniLink from '../../components/MiniLink'
import SubmitButton from '../../components/SubmitButton'
import Loading from '../../components/Loading'
import { signin } from '../../lib/session'
import Notification from '../../components/Notification'
import SerializeForm from '../../components/HOC/SerializeForm'

const USER_SIGNUP = gql`
  mutation signup($email: String! $fullname: String! $password: String! $reCaptchaResponse: String!) {
    signup(input: {
      fullname: $fullname,
      email: $email,
      password: $password,
      reCaptchaResponse: $reCaptchaResponse
    }) {
      token
      refreshToken
    }
  }
`

const View = styled.div`
  width: 100%;
  /* height: 100vh; */
`

const Box = styled.div`
  margin: 1em auto;
  width: 368px;
  padding: .5em;
  position: relative;
  user-select: none;
  box-sizing: content-box;
`

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Img = styled.img`
  width: 57%;
  padding: .5em 0;
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

class Registro extends Component {
  state = {
    reCaptchaResponse: null,
    notification: {
      show: false,
      message: ''
    }
  }

  recaptchaInstance = null

  verifyCallback = (reCaptchaResponse) => {
    console.log(reCaptchaResponse)
    this.setState({ reCaptchaResponse })
  }

  onResponse = ({ signup }) => {
    signin(signup.token, signup.refreshToken)
  }

  onError = (error) => {
    const err = error.graphQLErrors[0]
    // Informar al usuario y recetear recaptcha
    // Resetear recaptcha
    if (err.name === 'ValidationError') {
      if (err.data.message === 'Email ya registrado') {
        this.setState({
          notification: {
            show: true,
            message: 'El email ya estaba registrado ¿Quieres hacer Login?'
          }
        })
      }
      if (err.data.message === 'Recaptcha expired') {
        this.setState({
          notification: {
            show: true,
            message: 'La reCAPTCHA estaba expirada, intentar nuevamente '
          }
        })
      }
    }

    this.setState(state => ({
      ...state,
      data: { ...state.data, reCaptchaResponse: '' },
      validate: { ...state.validate, reCaptchaResponse: false }
    }))
    this.recaptchaInstance.reset()
  }

  closeNotification = () => this.setState({ notification: { show: false } })

  submit = (signup) => {
    const error = this.props.checkValidations()
    if (error) return window.alert(error)

    const { reCaptchaResponse } = this.state
    if (!this.state.reCaptchaResponse) {
      return window.alert('Confirma que no eres un Robot')
    }
    signup({ variables: { ...this.props.data, reCaptchaResponse } })
  }

  render () {
    const { email, password, fullname } = this.props.data
    const paymentProcess = this.props.paymentProcess === 'true' ? '?paymentProcess=true' : ''
    const activeSubmit = this.props.allValid() && this.state.reCaptchaResponse
    const { notification } = this.state

    return (
      <Mutation
        mutation={USER_SIGNUP}
        onCompleted={this.onResponse}
        onError={this.onError}
      >
        {(signup, { data, loading, error }) => (
          <View>
            <Notification
              show={notification.show}
              type='error'
              message={notification.message}
              close={this.closeNotification}
            />
            <Box>
              <SeoHead title='Registrate en Tecninja.io' />
              <Img src='/static/tecninja-logo.svg' />
              <InfoText>Crear cuenta</InfoText>
              <Loading show={loading} />
              <Input
                label='Nombre Completo'
                field='fullname'
                value={fullname}
                onChange={this.props.onChange}
                onValidate={this.props.onValidate}
              />
              <Input
                label='Email'
                field='email'
                type='email'
                value={email}
                pattern={/[^@]+@[^@]+\.[a-zA-Z]{2,}/g}
                onChange={this.props.onChange}
                onValidate={this.props.onValidate}
              />
              <Input
                label='Contraseña'
                field='password'
                minLength={6}
                value={password}
                type='password'
                onChange={this.props.onChange}
                onValidate={this.props.onValidate}
              />
              <Center>
                <Recaptcha
                  sitekey='6LeTQloUAAAAAMaWCtJi63iXbprACpdw0nYTJy8z'
                  render='explicit'
                  verifyCallback={this.verifyCallback}
                  onloadCallback={(e) => {
                    console.log('onloadCallback', e)
                  }}
                  expiredCallback={(e) => {
                    console.log('expiredCallback', e)
                  }}
                  elementID='validateChapta'
                  ref={e => { this.recaptchaInstance = e }}
                />
              </Center>
              <SubmitButton active={activeSubmit} onClick={() => this.submit(signup)}>
                Registrar
              </SubmitButton>
              <MiniLink href={`/login${paymentProcess}`}>
                ¿Ya tienes cuenta? Inicia Sesión
              </MiniLink>
            </Box>
          </View>
        )
        }
      </Mutation>
    )
  }
}

export default SerializeForm([
  { field: 'password', message: 'Ingresa la Contraseña minimo 6 Caracteres' },
  { field: 'email', message: 'Ingresa un Email Valido' },
  { field: 'fullname', message: 'Ingresa tu Nombre Completo' }
], Registro)
