import React from 'react'
import styled, {keyframes} from 'styled-components'
import getTechIcon from '../getTechIcon'

const History = styled.div`
  width: 280px;
  padding-left: 55px;
  background: #FFF;
  display: flex;
  position: fixed;
  transition: all .15s ease-in-out;
  justify-content: center;
  z-index: 600;
  flex-direction: column;
  overflow: auto;
  flex-grow: 0;
  top: 0;
`

const Item = styled.div`
  height: 55px;
  width: 100%;
  flex-shrink: 0;
  z-index: 500;
  font-size: 11px;
  /* border-bottom: 1px solid whitesmoke; */
`

const Anima = keyframes`
  0% {
    opacity: 0;
    bottom: 30px;
  }
  100% {
    opacity: 1;
    bottom: 0;
  }
`

const AllItem = styled.div`
  height: 55px;
  width: 100%;
  background-color: #FFF;
  border-bottom: 1px solid whitesmoke;
  font-size: 11px;
  animation: .4s ease-out ${Anima};
  animation-fill-mode: forwards;
  position: relative;
  flex-shrink: 0;
  opacity: .5;
  cursor: pointer;
  &:hover {
    opacity: 1;
    background-color: red;
  }
`
const HistoryItems = ({ show, historyItems }) => {
  if (show) {
    return (
      <React.Fragment>
        {historyItems.map(h => (
          <AllItem key={h.title}>{h.title}</AllItem>
        ))}
      </React.Fragment>
    )
  }
  return null
}

const CoverPanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CoverImg = styled.img`
  width: ${p => p.width};
  max-width: 150px;
`
const TitleBlock = styled.div`
  padding-left: .3em;
`

const Title = styled.div`
  color: #333;
  font-weight: bold;
`

const Subtitle = styled.div`
  color: gray;
  display: ${p => p.show ? 'block' : 'none'};
`

const HistoryComponent = ({ historyItems, expanded, isShowTools, tab, hasCourse, course, lesson }) => {
  let h = '55px'
  let left = '-50%'
  let justifyContent = 'center'
  let imgSize = '30px'
  let showSubtitle = true
  let overflow = 'hidden'

  const coverStyle = {
    flexDirection: 'row',
    fontSize: '11px',
    textAlign: 'left',
    padding: 0,
    justifyContent: 'space-evenly'
  }

  if (isShowTools) {
    h = '55px'
    left = '0'
  }

  if (expanded) {
    justifyContent = 'flex-start'
    h = '100vh'
    overflow = 'auto'
  }

  if (tab === 'course' && hasCourse) {
    // Curso activo y en foco
    // Cover debe ser grande
    h = '155px'
    left = '0'
    imgSize = '100px'
    coverStyle.flexDirection = 'column'
    coverStyle.fontSize = '15px'
    coverStyle.textAlign = 'center'
    coverStyle.padding = '0 .3em'
    // coverStyle.justifyContent = 'space-evenly'

    showSubtitle = false
  }

  const HistoryStyle = {
    height: h,
    left,
    overflow,
    justifyContent
  }

  return (
    <History style={HistoryStyle}>
      <Item >
        <CoverPanel style={coverStyle}>
          <CoverImg
            src={getTechIcon(course.tech)} // '/static/Node-elemental - copia-medium.png'
            width={imgSize}
          />
          <TitleBlock>
            <Title>{course.title}</Title>
            <Subtitle show={showSubtitle}>{lesson.title}</Subtitle>
          </TitleBlock>
        </CoverPanel>
      </Item>
      <HistoryItems show={expanded} historyItems={historyItems} />
    </History>
  )
}

HistoryComponent.defaultProps = {
  historyItems: [
    {
      title: 'Que son las props en React',
      slug: 'que-son-las-props-en-react',
      tech: 'rxjs',
      isWatched: true,
      techVersion: '16.3.2'
    },
    {
      title: 'Manejo de estado en React',
      slug: 'manejo-de-estado-en-react',
      tech: 'react',
      isWatched: true,
      techVersion: '16.3.2'
    },
    {
      title: 'Nueva Leccion asi bin Genial y Cool',
      slug: 'nueva-leccion-asi-bin-genial-y-cool',
      tech: 'angular',
      isWatched: true,
      techVersion: '16.3.2'
    },
    {
      title: 'Como crear un modulo en NPM',
      slug: 'como-crear-un-modulo-en-npm',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Que son las props en React 2',
      slug: 'que-son-las-props-en-react-2',
      tech: 'react',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Manejo de estado en React 3',
      slug: 'manejo-de-estado-en-react-3',
      tech: 'react',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Nueva Leccion asi bin Genial y Cool asi',
      slug: 'nueva-leccion-asi-bin-genial-y-cool-asi',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Otra Leccion asi bien Shevere',
      slug: 'otra-leccion-asi-bien-shevere',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Bienvenida al Curso de PostCSS',
      slug: 'bienvenida-al-curso-de-postcss',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Los nuevos módulos de CSS',
      slug: 'los-nuevos-modulos-de-css',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Selectores personalizados',
      slug: 'selectores-personalizados',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Modulariza tu código con postcss-Imports',
      slug: 'modulariza-tu-codigo-con-postcss-imports',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Optimiza CSS para producción con CSSNano',
      slug: 'optimiza-css-para-produccion-con-cssnano',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: '¿Qué es Node.js?',
      slug: 'que-es-node.js',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Características de la plataforma Node.js',
      slug: 'caracteristicas-de-la-plataforma-node.js',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Arquitectura y Componentes del proyecto',
      slug: 'arquitectura-y-componentes-del-proyecto',
      tech: 'rxjs',
      isWatched: true,
      techVersion: '16.3.2'
    },
    {
      title: 'Estructura básica de un módulo de Node.js',
      slug: 'estructura-basica-de-un-modulo-de-node.js',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Cómo hacer Mocks y Stubs con Sinon',
      slug: 'como-hacer-mocks-y-stubs-con-sinon',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Realizando un ejemplo con el módulo de base de datos',
      slug: 'realizando-un-ejemplo-con-el-modulo-de-base-de-datos',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Definición de un Broker de Mensajería',
      slug: 'definicion-de-un-broker-de-mensajeria',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Pruebas básicas de Integración con Ava y supertest',
      slug: 'pruebas-basicas-de-integracion-con-ava-y-supertest',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Asegurando nuestra API con express-jwt',
      slug: 'asegurando-nuestra-api-con-express-jwt',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: '¿Qué vamos a construir en el curso avanzado de Node.js?',
      slug: 'que-vamos-a-construir-en-el-curso-avanzado-de-node.js',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    },
    {
      title: 'Implementación de un servidor web estático con express',
      slug: 'implementacion-de-un-servidor-web-estatico-con-express',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2'
    }
  ]
}

export default HistoryComponent
