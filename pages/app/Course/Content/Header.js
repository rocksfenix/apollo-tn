import React from 'react'
import styled from 'styled-components'
import warna from 'warna'
import getTechIcon from '../../getTechIcon'

const Header = styled.header`
  margin-top: 50px;
  display:flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  justify-content: flex-start;
  margin-left: 1em;
  max-width: 700px;
  margin: 0 auto;
`

const Box = styled.header`
  display:flex;
  align-items: center;
  padding: 0;
`

const Title = styled.h1`
  margin: 0;
  color: rgb(29, 31, 39);
`
const TechLogo = styled.img`
  width: 90px;
  padding: .3em 0;
`
const VersionBox = styled.div`
  margin-top: 0.6em;
  display: flex;
`
const Version = styled.span`
  padding: .3em .6em;
  background: ${p => p.gradient};
  color: #FFF;
  border-radius: 3px;
  font-size: 14px;
`

const TitleBox = styled.div`
  padding-left: .8em;
  display: flex;
  flex-direction: column;
`

const Glow = styled.div`
  width: 33px;
  height: 33px;
  filter: blur(17px);
  background-color: ${p => p.color};
  border-radius: 50%;
  position: absolute;
  opacity: .5;
`

// linear-gradient(90deg, #0b4178, #01010b)
const Comp = ({ lesson, course }) => {
  return (
    <Header>
      <Box>
        <TechLogo src={getTechIcon(lesson.tech)} />
        <TitleBox>
          <Title>{ lesson.title }</Title>
          <VersionBox>
            <Glow color={course.color} />
            <Version
              gradient={`linear-gradient(90deg, ${warna.darken(course.color, 0.7).hex}, #01010b)`}
            >@{ lesson.techVersion }</Version>
          </VersionBox>
        </TitleBox>
      </Box>
    </Header>
  )
}

// Comp.defaultProps = {
//   title: 'Para que son las props en React.js',
//   techVersion: '@16.3.1',
//   mainTech: 'node.png',
//   color: '#f94401'
// }

export default Comp
