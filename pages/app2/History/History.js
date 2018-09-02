import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import ItemHistory from './ItemHistory'

const Panel = styled.div`
  width: ${p => p.isMobile ? '100%' : '355px'};
  height: ${p => p.height};
  padding-left: 55px;
  display: ${p => p.size === 'playing' ? 'none' : 'flex'};
  position: fixed;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 0;
  top: 0;
  background-color: #FFF;
  transition: transform .2s cubic-bezier(1,0,0,1);
  transform: ${p => p.show ? 'translateX(0%)' : 'translateX(-100%)'};
  justify-content: ${p => p.expanded ? 'flex-start' : 'center'};
  will-change: transform, height;
  border-right: 1px solid whitesmoke;
  overflow:  ${p => p.expanded ? 'auto' : 'hidden'};
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.06);

  @media screen and (orientation: landscape) and (max-width: 900px){
      height: ${p => {
    if (p.size === 'mini') return '55px'
    if (p.size === 'full') return p.height
  }};
    };
  }



   /* width */
   ::-webkit-scrollbar {
      width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #FFF
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #ecebf1;
      border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: black; 
  }
`

const HistoryItems = ({ show, size, historyItems }) => {
  if (show) {
    return (
      <React.Fragment>
        {historyItems.map(item => (
          <ItemHistory item={item} size={size} animated />
        ))}
      </React.Fragment>
    )
  }
  return null
}

const LoadingBox = styled.div`
  width: 100%;
  height: 100px;
  display: ${p => p.show ? 'flex' : 'none'};
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
`

const Spinner = styled.img`
  width: 120px;
`

class HistoryComponent extends Component {
  //
  fetchMoreData = () => {
    console.log('GET MORE ITEMS')
  }

  render () {
    const { show, tab, playing, historyItems, lastWatched, showMobileNav, isMobile } = this.props
    // Existen solo 3 tamaños diferentes
    // full - mini - playing
    // show indica si esta visible
    let height = '55px'

    const expanded = tab === 'history'

    // Tamaños
    let size = 'mini'
    if (tab === 'history') size = 'full'
    if (playing && tab === 'course') size = 'playing'

    // Si esta expandido el Height es del 100vh
    if (expanded) height = '100vh'

    // Si la tab es course y hay curso activo el height es 155px
    if (playing && tab === 'course') height = '155px'

    let _show = show

    // Se oculta si es mobile y esta
    // ocula la barra de navegacion
    if (isMobile && !showMobileNav) _show = false

    console.log(height)

    return (
      <Panel
        id='scrollableHistory'
        show={_show}
        height={height}
        expanded={expanded}
        isMobile={isMobile}
        size={size}
      >
        <InfiniteScroll
          dataLength={historyItems.length + 1}
          next={this.fetchMoreData}
          hasMore
          scrollableTarget='scrollableHistory'
          style={{ overflow: 'hidden' }}
          loader={
            (
              <LoadingBox show={expanded}>
                <Spinner src='/static/ellipsis.svg' />
              </LoadingBox>
            )
          }
        >
          <ItemHistory item={lastWatched} size={size} isMobile={isMobile} />
          <HistoryItems show={expanded} historyItems={historyItems} size={size} />
        </InfiniteScroll>
      </Panel>
    )
  }
}

HistoryComponent.defaultProps = {
  lastWatched: {
    title: 'Como crear estados en React',
    courseTitle: 'React Elemental',
    tech: 'react'
  },
  historyItems: [
    {
      title: 'Que son las props en React',
      slug: 'que-son-las-props-en-react',
      tech: 'rxjs',
      isWatched: true,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Manejo de estado en React',
      slug: 'manejo-de-estado-en-react',
      tech: 'react',
      isWatched: true,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Nueva Leccion asi bin Genial y Cool',
      slug: 'nueva-leccion-asi-bin-genial-y-cool',
      tech: 'angular',
      isWatched: true,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Como crear un modulo en NPM',
      slug: 'como-crear-un-modulo-en-npm',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Que son las props en React 2',
      slug: 'que-son-las-props-en-react-2',
      tech: 'react',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Manejo de estado en React 3',
      slug: 'manejo-de-estado-en-react-3',
      tech: 'react',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Nueva Leccion asi bin Genial y Cool asi',
      slug: 'nueva-leccion-asi-bin-genial-y-cool-asi',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Otra Leccion asi bien Shevere',
      slug: 'otra-leccion-asi-bien-shevere',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Bienvenida al Curso de PostCSS',
      slug: 'bienvenida-al-curso-de-postcss',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Los nuevos módulos de CSS',
      slug: 'los-nuevos-modulos-de-css',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Selectores personalizados',
      slug: 'selectores-personalizados',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Modulariza tu código con postcss-Imports',
      slug: 'modulariza-tu-codigo-con-postcss-imports',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Optimiza CSS para producción con CSSNano',
      slug: 'optimiza-css-para-produccion-con-cssnano',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: '¿Qué es Node.js?',
      slug: 'que-es-node.js',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Características de la plataforma Node.js',
      slug: 'caracteristicas-de-la-plataforma-node.js',
      tech: 'node',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Arquitectura y Componentes del proyecto',
      slug: 'arquitectura-y-componentes-del-proyecto',
      tech: 'rxjs',
      isWatched: true,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Estructura básica de un módulo de Node.js',
      slug: 'estructura-basica-de-un-modulo-de-node.js',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Cómo hacer Mocks y Stubs con Sinon',
      slug: 'como-hacer-mocks-y-stubs-con-sinon',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Realizando un ejemplo con el módulo de base de datos',
      slug: 'realizando-un-ejemplo-con-el-modulo-de-base-de-datos',
      tech: 'rxjs',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Definición de un Broker de Mensajería',
      slug: 'definicion-de-un-broker-de-mensajeria',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Pruebas básicas de Integración con Ava y supertest',
      slug: 'pruebas-basicas-de-integracion-con-ava-y-supertest',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Asegurando nuestra API con express-jwt',
      slug: 'asegurando-nuestra-api-con-express-jwt',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: '¿Qué vamos a construir en el curso avanzado de Node.js?',
      slug: 'que-vamos-a-construir-en-el-curso-avanzado-de-node.js',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    },
    {
      title: 'Implementación de un servidor web estático con express',
      slug: 'implementacion-de-un-servidor-web-estatico-con-express',
      tech: 'angular',
      isWatched: false,
      techVersion: '16.3.2',
      courseTitle: 'React Elemental'
    }
  ]
}

export default HistoryComponent
