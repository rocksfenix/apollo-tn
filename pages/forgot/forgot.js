import React, {Component} from 'react'
import styled from 'styled-components'
import Recaptcha from 'react-recaptcha'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Head from '../../components/SeoHead'
import Navegation from '../../components/Navegation'
import MiniLink from '../../components/MiniLink'
import Input from '../../components/Input'
import SubmitButton from '../../components/SubmitButton'
import SerializeForm from '../../components/HOC/SerializeForm'

const FORGOT = gql`
  mutation forgot($email: String! $paymentProcess: Boolean, $reCaptchaResponse: String!) {
    forgot(email: $email, paymentProcess: $paymentProcess, reCaptchaResponse: $reCaptchaResponse) {
      success
      message
    }
  }
`

const View = styled.div`
  overflow: hidden;
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  padding-top: 55px;
  position: relative;
`
const Box = styled.div`
  margin: 1em auto;
  max-width: 368px;
  padding: .5em;
  position: relative;
  user-select: none;
  box-sizing: content-box;
`

const MessageBox = styled.div`
  width: 600px;
  background: #93ffbf;
  font-family: Roboto;
  padding: 30px;
  margin: 10% auto;
  border-radius: 5px;
  display: ${props => props.show ? 'block' : 'none'};

  @media (max-width:768px) {
    width: 100%;
  }
`

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

class ForgotComponent extends Component {
  state = {
    reCaptchaResponse: null
  }

  recaptchaInstance = null

  verifyCallback = (reCaptchaResponse) => {
    this.setState({ reCaptchaResponse })
  }

  onResponse = ({ forgot: { success, message } }) => {
    if (!success) {
      window.alert(message)
      this.setState({ reCaptchaResponse: null })
      return this.recaptchaInstance.reset()
    }
  }

  submit = (forgot) => {
    const error = this.props.checkValidations()
    if (error) return window.alert(error)

    const { reCaptchaResponse } = this.state
    if (!this.state.reCaptchaResponse) {
      return window.alert('Confirma que no eres un Robot')
    }

    forgot({ variables: { ...this.props.data, reCaptchaResponse } })
  }

  render () {
    const activeSubmit = this.props.allValid() && this.state.reCaptchaResponse

    return (
      <Mutation
        mutation={FORGOT}
        onCompleted={this.onResponse}
      >
        {(forgot, { data, loading, error }) => (
          <View>
            <Head title='Recuperar Contraseña' />
            <Navegation />
            {
              data
                ? (
                  <MessageBox show>
                    <i className='icon-ninja-2' />
                    ... Si tu email esta registrado en nuestra base de datos te enviaremos mas
                    intrucciones para recuperar tu cuenta!
                  </MessageBox>
                )
                : (
                  <Box>
                    <InfoText> Recuperar Contraseña </InfoText>
                    {/* <Text>Ingresa el email con el que te registraste</Text> */}
                    <Input
                      label='Email con el que te registraste'
                      field='email'
                      type='email'
                      value={this.props.data.email}
                      pattern={/[^@]+@[^@]+\.[a-zA-Z]{2,}/g}
                      onChange={this.props.onChange}
                      onValidate={this.props.onValidate}
                    />
                    <Center>
                      <Recaptcha
                        sitekey='6LeTQloUAAAAAMaWCtJi63iXbprACpdw0nYTJy8z'
                        render='explicit'
                        verifyCallback={this.verifyCallback}
                        elementID='validateChaptaForgot'
                        ref={e => { this.recaptchaInstance = e }}
                      />
                    </Center>
                    <SubmitButton
                      active={activeSubmit}
                      onClick={() => { this.submit(forgot) }}>Solicitar Contraseña</SubmitButton>

                    <MiniLink href='/registro'>¿No tienes cuenta? Registrate</MiniLink>
                    <MiniLink href='/login'>O Iniciar Seccion</MiniLink>
                  </Box>
                )
            }

          </View>
        )}
      </Mutation>
    )
  }
}

export default SerializeForm([
  {
    field: 'email',
    message: 'Ingreasa un Email valido'
  }
], ForgotComponent)
