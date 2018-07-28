import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Head from '../../components/SeoHead'

const View = styled.div`
  overflow-x: hidden;
  min-height: 100vh;
  width: 100%;
  height: 100vh;
  padding-top: 55px;
`

const ImageBox = styled.img`
  width: 300px;
  display: block;
  margin: 10px auto;
`

const MainImageBox = styled.img`
  width: 500px;
  max-width: 500px;
  min-height: 300px;
  margin: 0 auto;
  display: block;

  @media (max-width: 900px) {
    width: 100%;
  }
`

const Row = styled.section`
  width: 80%;
  display: flex;
  margin: 50px auto;
`
const Textblock = styled.section`
  width: 60%;
  display: flex;
  align-items: center;
  font-size: 30px;  
  font-size: 24px;
  margin: 10px auto 10px auto;
  line-height: 36px;
  text-align: ${props => props.align};
  color: #1b1b1b;

  @media (max-width: 900px) {
    width: 90%;
    font-size: 20px;
  }
`

const SectionFAQS = styled.section`
  width: 80%;
  margin: 10px auto;
  border: 1px solid black;
  border-radius: 3px;
  min-height: 500px;
  background-color: #f9f9f9;
  border: 1px solid #ececec;
  padding: 1em;

  @media (max-width: 900px) {
    padding: 0;
  }
`

const Title = styled.h2`
  font-size: 36px;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin: 0;
  font-size: 50px;
  color: #2b1968;
  color: rgb(65, 70, 116);
`

const Subtitle = styled.h2`
  font-size: 36px;
  color: #333;
  font-weight: bold;
  text-align: ${props => props.align || 'center'};
  margin: 2em auto 1em auto;
  font-size: 30px;
`

const Success = styled.img`
  width: 25px;
  height: 25px;
  margin-right: .5em;
  
`

const ItemText = styled.div`
  
`

const Items = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 3em auto;
  max-width: 700px;

  @media (max-width: 900px) {
    padding-left: 1em;
  }
`

const LevelUpButton = styled.a`
  background: linear-gradient(133deg, #262d67, #50a3e3);
  width: 100%;
  max-width: 300px;
  text-decoration: none;
  line-height: 2;
  font-size: 25px;
  padding: 2px 0;
  text-align: center;
  border: 0;
  border-radius: 50px;
  color: #FFF;
  margin: 5px auto;
  outline: none;
  cursor: pointer;
  transition: all .2s ease-out;

  &:hover {
    opacity: .8;
  }

  @media (max-width: 900px) {
    font-size: 22px;
    padding: 3px 0;
  }
`

const Question = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 1em 0 .2em 1em;
`

const Answer = styled.div`
  font-weight: 100;
  font-size: 18px;
  margin: 0em 0 .2em 1em;
`

const Text = styled.div`
  text-align: center;
  padding: 0 .5em;
`

const ItemEl = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: .5em;

  @media (max-width: 900px) {
    height: 50px;
    margin-bottom: 0;
  }
`

const Item = ({ children }) => (
  <ItemEl>
    <Success src='/static/success.svg' />
    <ItemText>{ children }</ItemText>
  </ItemEl>
)

class ProPage extends React.Component {
  render () {
    return (
      <View>
        <Head title='Sube de Nivel Tecninja.io | registro' />
        <Title align='center'>NINJA PRO</Title>
        <MainImageBox src='/static/ser-ninja-developer.svg' />
        <Textblock align='center'>
          Sube de Nivel con lecciones actualizadas de las mejores herramientas para el desarrollo Fullstack de tecnologias Web
        </Textblock>
        <Subtitle>Que obtengo por ser Miembro Ninja PRO?</Subtitle>
        <Items>
          <Item>Acceso instantáneo a todas las series y lecciones.</Item>
          <Item>Acceso a todos los códigos de ejemplos</Item>
          <Item>Lecciones nuevas todas las semanas</Item>
          <Item>Transcripciones con ejemplos de código, imágenes y terminal.</Item>
          <Item>Notas de Codigo</Item>
          <Item>Soporte prioritario.</Item>
          <Item>Mejora tu carrera</Item>
        </Items>

        <Text>Sube ahora mismo a Ninja PRO y enterate porque la comunidad nos ama.</Text>

        <ImageBox src='/static/love-tec-ninja.svg' />

        <Row>
          <Link href='/suscribete'>
            <LevelUpButton>Subir de Nivel</LevelUpButton>
          </Link>
        </Row>

        <SectionFAQS>
          <Question align='left'>Preguntas Frecuentes</Question>
          <Question>¿Puedo cancelar en cualquier momento?</Question>
          <Answer>Claro, desde el menu de tu cuenta</Answer>
          <Question>¿Ofrecen algun descuento?</Question>
          <Answer>Como lanzamiento hemos rebajado el precio de la suscripcion de $20 USD a $9.9 USD eso es el 51.5% de descuento</Answer>
          <Question>¿Cuántos cursos puedo ver por mes?</Question>
          <Answer>No hay límites con tu suscripción Ninja PRO puedes ver todos los cursos y todas las lecciones ilimitadamente.</Answer>
          <Question>¿Qué tan seguido suben nuevas lecciones?</Question>
          <Answer>Subimos nuevas lecciones y cursos en progreso casi todos los días. Queremos movernos y que te muevas tan rápido como lo hace la tecnología</Answer>
          <Question>¿Qué tipos de pago aceptan?</Question>
          <Answer>Aceptamos tarjetas de crédito o débito. De momento no aceptamos PayPal / Bitcoin etc.</Answer>
          <Question>¿Cuales Series / Cursos tiene disponibles?</Question>
          <Answer>Puedes ver nuestro cursos disponibles y proximos a lanzar <a href='/cursos'>desde aqui!</a></Answer>
        </SectionFAQS>
        <Row>
          <Link href='/suscribete'>
            <LevelUpButton>Subir de Nivel</LevelUpButton>
          </Link>
        </Row>
      </View>
    )
  }
}

// {/* Nuestro compromiso, ofrecerte lecciones de alta calidad para un aprendisaje continuo y sin dolor */}
// {/* "No te damos el producto, te damos la formula y después tu construyes lo que quieras." */}
// {/* Si puedo evitarde mucho dolor y frustracion y hacer que aprendas muchas cosas que creias complicadas, me doy por servido */}
// {/* Para mi era muy frustrante querer recurdar algun concepto de otra leccion tener que navegar a otra url, la frustracion de tener
// que buscar el cuerso y la leccion que queria repasar, abrrla en otra tab (me inundaba de tabs) y despues volver a la leccion y
// el curso que estaba viendo inicialmente, bahh */}

// Hay plataformas que te enseñas los conceptos al mismo tiempo que crean un proyecto, es componentWillMount = () => {
//   pero lo malos de esto es que puede ser frustrante y te puedes confundir
//   nosotros tenemos series donde aprenderas los fundamentos, la teoria llamados Cursos

//   y series tutoriales donde te enseñamos a desarrollar diferentes proyectos
// }

export default ProPage
