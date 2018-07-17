import React from 'react'
import styled from 'styled-components'
import Navegation from '../../components/Navegation'
import SeoHead from '../../components/SeoHead'
import Cursos from '../../components/cursos'

const View = styled.div`
  overflow-x: hidden;
`

export default () => (
  <View>
    <SeoHead title='Cursos de Desarrollo' />
    <Navegation />
    <Cursos />
  </View>
)
