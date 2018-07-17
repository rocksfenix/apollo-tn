import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import queryString from 'query-string'
import Recaptcha from 'react-recaptcha'
import { Mutation } from 'react-apollo'
import Input from '../../components/Input'
import SubmitButton from '../../components/SubmitButton'
import SerializeForm from '../../components/HOC/SerializeForm'

const RECOVERY = gql`
  mutation recovery($reCaptchaResponse: String! $email: String! $acid: String! $password: String!) {
    recovery(reCaptchaResponse: $reCaptchaResponse, email: $email, acid: $acid, password: $password) {
      success
      message
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
const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

class RecoveryPage extends React.Component {
  state = {
    reCaptchaResponse: null
  }

  verifyCallback = (reCaptchaResponse) => {
    this.setState({ reCaptchaResponse })
  }

  onResponse = ({ recovery: { success, message } }) => {
    if (!success) {
      window.alert(message)
      this.setState({ reCaptchaResponse: null })
      return this.recaptchaInstance.reset()
    }

    window.alert(message)
    window.location = '/login'
  }

  submit = (recovery) => {
    const error = this.props.checkValidations()
    if (error) return window.alert(error)
    const { password, passwordConfirm } = this.props.data
    if (password !== passwordConfirm) return window.alert('Las contraseñas no coinciden')

    const { reCaptchaResponse } = this.state
    if (!this.state.reCaptchaResponse) {
      return window.alert('Confirma que no eres un Robot')
    }

    // Parseamos la URL
    const { acid } = queryString.parse(window.location.search)

    recovery({ variables: {
      ...this.props.data,
      acid,
      reCaptchaResponse
    }})
  }

  render () {
    const { email, password, passwordConfirm } = this.props.data
    // console.log(this.props.query)
    const activeSubmit = this.props.allValid() && this.state.reCaptchaResponse && this.props.data.password === this.props.data.passwordConfirm
    return (

      <Mutation
        mutation={RECOVERY}
        onCompleted={this.onResponse}
      >
        {(recovery, { data, loading, error }) => (
          <Box>
            <InfoText>Cambiar Contraseña</InfoText>
            <Input
              label='Email Registrado'
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
            <Input
              label='Confirmar Contraseña'
              field='passwordConfirm'
              minLength={6}
              value={passwordConfirm}
              type='password'
              onChange={this.props.onChange}
              onValidate={this.props.onValidate}
              onEnter={this.submit}
            />
            <Center>
              <Recaptcha
                sitekey='6LeTQloUAAAAAMaWCtJi63iXbprACpdw0nYTJy8z'
                render='explicit'
                verifyCallback={this.verifyCallback}
                elementID='validateChaptaRecovery'
                ref={e => { this.recaptchaInstance = e }}
              />
            </Center>
            <SubmitButton
              active={activeSubmit}
              onClick={() => { this.submit(recovery) }}>Confirmar</SubmitButton>
          </Box>
        )}
      </Mutation>
    )
  }
}

export default SerializeForm([
  { field: 'passwordConfirm', message: 'Confirma tu Contraseña' },
  { field: 'password', message: 'Ingreasa Password valida, minimo 6 caracteres' },
  { field: 'email', message: 'Ingreasa un Email valido' }
], RecoveryPage)
