import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { logout } from '../../lib/session'
import Title from '../../components/Title'
import WithUser from '../../components/HOC/WithUser'

const ACCEPT = gql`
  mutation acceptTerms($acceptTermsAndPrivacy: Boolean!) {
    userUpdate(input: {
      acceptTermsAndPrivacy: $acceptTermsAndPrivacy
    }) {
      _id
      acceptTermsAndPrivacy
      acceptTermsAndPrivacyUpdated
    }
  }
`

const Panel = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #FFF;
  position: fixed;
  top: 0;
`

const Section = styled.div`
  max-width: 700px;
  min-height: 400px;
  margin: 0 auto;
  @media (max-width: 900px) {
    padding: 0 1em;;
  }
`

const Image = styled.img`
  width: 40%;
  display: block;
  margin: 0 auto;

  @media (max-width: 900px) {
    width: 93%;
  }
`

const Information = styled.div`
  font-weight: 100;
  font-size: 18px;
  color: #353f4f;
  margin: 1em 0;
`

const Accept = styled.div`
  width: 100%;
  font-weight: 100;
  font-size: 16px;
  color: #353f4f;
  margin: 1em 0 2em 0;

  @media (max-width: 900px) {
    margin: 1em 0;
  }
`

const ButtonLine = styled.button`
  border: 1px solid red;
  color: red;
  padding: .50em 4em;
  border-radius: 3px;
  margin: 0 .3em;
  cursor: pointer;
  font-family: 'Roboto';
  background-color: #FFF;
  transition: all .3s ease-out;

  @media (max-width: 900px) {
    width: 50%;
    padding: .50em 0;
  }

  &:hover {
    opacity: .7;
  }
`

const Button = styled.button`
  border: 2px solid transparent;
  padding: .50em 4em;
  border-radius: 3px;
  margin: 0 .3em;
  color: #FFF;
  cursor: pointer;
  font-family: 'Roboto';
  transition: all .3s ease-out;
  background-color: #5da508;

  @media (max-width: 900px) {
    width: 50%;
    padding: .50em 0;
  }

  &:hover {
    opacity: .7;
  }
`
const Buttons = styled.div`
  width: 100%;
  display: flex;
`

const PrivacyLink = styled.a`
  /* text-decoration: underline; */
  color: #4d58d8;
  font-size: 15px;
  margin: .5em 0 0 2em;;
  /* margin: 0 .5em; */
  display: block;
`

const onResponse = ({ userUpdate: { acceptTermsAndPrivacy } }) => {
  if (!acceptTermsAndPrivacy) {
    return logout('/?rejected-policy=true')
  }
  window.location = '/app?welcome=true'
}

const AcceptTerms = (props) => (
  <Mutation
    mutation={ACCEPT}
    onCompleted={onResponse}
    // variables
  >
    {(acceptTerms, { data, loading, error }) => (
      <Panel>
        <Section>
          <Image src='/static/trueno.svg' />
          <Title textAlign='center' textTransform='capitalize' as='h4' size='33px'>Hola { props.user.fullname }</Title>
          <Information>
              Nos tomamos muy enserio la privacidad de tu informacion, revisa por favor:
          </Information>
          <PrivacyLink href='/politica-de-privacidad' target='_blank'>Politica de Privacidad </PrivacyLink>
          <PrivacyLink href='/terminos-de-servicio' target='_blank'>Terminos de Servicio</PrivacyLink>
          <Accept>* Aceptar Politica de Privacidad y terminos de Servicio.</Accept>
          <Buttons>
            <ButtonLine danger onClick={() => {
              acceptTerms({ variables: {
                acceptTermsAndPrivacy: false
              }})
            }}>Rechazar</ButtonLine>
            <Button success onClick={() => {
              acceptTerms({ variables: {
                acceptTermsAndPrivacy: true
              }})
            }}>* Aceptar</Button>
          </Buttons>
        </Section>
      </Panel>
    )}
  </Mutation>
)
export default WithUser(AcceptTerms)
