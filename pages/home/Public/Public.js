import React from 'react'
import styled from 'styled-components'
import NinjaSplash from '../NinjaSplash'
import Benefits from '../Benefits'
import Section from '../../../components/Section'
import Parragraph from '../../../components/Parragraph'
import Title from '../../../components/Title'
import LinkButton from '../../../components/LinkButton'

const Panel = styled.div`
  width: 100%;
`

export default (props) => {
  return (
    <Panel>
      <NinjaSplash />
      <Benefits />
      <Section>
        <Title as='h6' size='38px' textAlign='center'>Únete Ahora</Title>
        <Parragraph>
          ¿Que esperas? Comienza con una cuenta gratuita y disfrutar de las series y
          cursos gratuitos que tenemos para ti.
        </Parragraph>
        <LinkButton shape='round' gradient='ocean' href='/registro'>Crear Cuenta</LinkButton>
      </Section>
    </Panel>
  )
}
