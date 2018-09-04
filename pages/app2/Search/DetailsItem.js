import React from 'react'
import styled from 'styled-components'
import getTechIcon from '../getTechIcon'

const CoverImg = styled.img`
  width: 20px;
  max-width: 150px;
  will-change: width;
`

const TitleBlock = styled.div`
  padding-left: .7em;
`

const Title = styled.div`
  color: #333;
  font-weight: bold;
  font-size: 15px;
  transition: all .2s ease-in;

  @media (max-width:900px) {
    font-size: 15px;
  }
`

const Time = styled.div`
  color: gray;
  font-size: 14px;

  @media (max-width:900px) {
    font-size: 13px;
  }
`

const CoverPanel = styled.div`
  width: 97%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: row;
  padding: 1em;
  border-bottom: 1px solid #f3f3f3;
  border: ${p => p.active ? `2px solid ${p.color}` : '2px solid transparent'};
  padding: .3em 1em;
  border-radius: 4px;
`

export default ({ focus, course, lesson, onChangeLesson, onSetIndex2, index, color }) => (
  <CoverPanel
    color={color}
    active={focus}
    onClick={() => onChangeLesson(lesson.slug)}
    // Es mas 1 porque se agrega el boton Play como indice 0
    onMouseOver={() => onSetIndex2(index + 1)}
  >
    <CoverImg src={getTechIcon(lesson.tech)} />
    <TitleBlock>
      <Title>{lesson.title}</Title>
      <Time>{lesson.duration}</Time>
    </TitleBlock>
  </CoverPanel>
)
