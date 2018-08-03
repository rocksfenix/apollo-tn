import React from 'react'
import styled, {keyframes} from 'styled-components'

/* left: ${props => props.show ? '0px' : '-100%'};  */
const History = styled.div`
  width: 100%;
  width: ${p => p.isShowTools ? '280px' : '100%'};
  height: ${p => p.height};
  background: ${p => p.isShowTools ? '#FFF' : '#FFF'};
  /* border-right: 1px solid #e5e5e5; */
  display: flex;
  position: absolute;
  transition: all .15s ease-in-out;
  justify-content: center;
  justify-content: ${p => p.show ? 'flex-start' : 'flex-start'};
  z-index: 1000;
  flex-direction: column;
  /* background-color: yellow; */
  overflow: auto;
  /* flex-wrap: wrap; */
  flex-grow: 0;
`

const CoverPanel = styled.div`
  /* max-width: 225px; */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 55px;
`

const CoverImg = styled.img`
  width: ${p => p.width};
  max-width: 150px;
`

// height: ${p => p.height};
// float: right;
// width: 100%;
// display: flex;
// align-items: center;
// flex-direction: column;
// transition: all .3s ease-out;
const Item = styled.div`
  padding-left: 55px;
  height: 55px;
  width: 100%;
  /* background-color: tomato; */
  flex-shrink: 0;
  z-index: 500;
  /* color: #FFF; */
  font-size: 11px;
  border-bottom: 1px solid whitesmoke;
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
  padding-left: 55px;
  height: 55px;
  width: 100%;
  background-color: #FFF;
  border-bottom: 1px solid whitesmoke;
  /* color: #FFF; */
  font-size: 11px;
  animation: .4s ease-out ${Anima};
  animation-fill-mode: forwards;
  position: relative;
  /* z-index: -1; */
  flex-shrink: 0;
  opacity: .5;
  cursor: pointer;
  /* opacity: .8; */
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

const HistoryComponent = ({ show, height, historyItems, isShowTools }) => {
  // Limpiar la logica de esta seccion solo
  // 3 Estados disponibles
  // * Full
  // * Medium - En reproduccion
  // * Small - en Toolbox show
  let h = '55px'
  let imgSize = '40px'

  if (height === 'medium') {
    h = '165px'
    imgSize = '100px'
  }

  if (height === 'big') {
    h = '100vh'
    imgSize = '40px'
  }

  return (
    <History show={show} height={h} isShowTools={isShowTools}>
      <Item >item</Item>
      <HistoryItems show={show} historyItems={historyItems} />
      
      {/* <CoverPanel>
        <CoverImg
          src='/static/Node-elemental - copia-medium.png'
          width={imgSize}
        />
      </CoverPanel> */}
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
