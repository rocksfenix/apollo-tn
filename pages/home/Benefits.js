import React from 'react'
import styled from 'styled-components'
import Benefit from '../../components/Benefit'

const Benefits = styled.div`
  width: 80%;
  margin: 0 auto;

  @media (max-width: 900px) {
    width: 95%;
  }
`

export default () => (
  <Benefits>
    <Benefit
      direction='left'
      title='Metodología LEAP'
      description='(Learning Easy and Progressive) Es nuestra metodología para que cada leccion sea consistente y de alta calidad.'
      imageSrc='/static/leap.svg'
      alt='Imagen de Metodologia LEAP'
    />
    <Benefit
      direction='right'
      title='Lecciones Claras y Modulares'
      description='Has visto tutores que dominan el tema pero que no saben explicarlo o se van por las ramas, con lecciones demasiado extensas, perdiendo tu tiempo, enfoque y claridad mental. Adiós a esto, nuestras lecciones son enfocadas, concretas y modulares.'
      imageSrc='/static/lecciones-claras-y-modulares.svg'
      alt='Imagen de Lecciones Claras y Modulares'
    />
    <Benefit
      direction='left'
      title='Lecciones Express'
      description='Te pasó que viste un curso de varias horas solo para llegar a la parte que te interesaba, perdiendo horas en el proceso. Nuestras Lecciones son rápidas ~5~10 minutos lo que promueve un mayor grado de atención y mejores resultados.'
      imageSrc='/static/lecciones-express.svg'
      alt='Imagen de Lecciones Express'
    />
    <Benefit
      direction='right'
      title='Actualizaciones Periódicas'
      description='Sabemos que la tecnologia evoluciona todos los dias por eso lanzamos nuevas lecciones constantemente, cursos en progreso se pueden ir viendo, ya no tendras que esperar a que finalice el curso para que lo puedas ver.'
      imageSrc='/static/actualizaciones-periodicas.svg'
      alt='Imagen de Lecciones Periodicas'
    />
    <Benefit
      direction='left'
      title='Open Lessons'
      description='Para la comunidad hacemos constantemente lecciones para que puedas aprender cosas puntuales, estos son totalmente gratuitas.'
      imageSrc='/static/open-lessons.svg'
      alt='Imagen de Open Lessons'
    />
  </Benefits>
)
