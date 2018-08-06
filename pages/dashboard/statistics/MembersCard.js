import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  width: 100%;
  display: flex;
`

const Column = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Number = styled.div`
  font-family: Roboto;
  font-size: ${props => props.fontSize};
  font-weight: bold;
  color: #21203a;
  text-align: center;
  border-bottom: 1px solid #dedede;
  height: 80px;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;  
`

const Title = styled.div`
  width: 100%;
  line-height: 2.5;
  text-align: center;  
  font-family: Roboto;
`

const Description = styled.div`
  font-family: Roboto;
  font-size: 18px;
  font-weight: 100;
  color: gray;
  text-align: center;
  color: #d4d4d4;
  line-height: 1.5;
`

const NumberCardComponent = ({ title, today, all }) => (
  <Card>
    <Title>{ title }</Title>
    <Row>
      <Column>
        <Number fontSize='65px'>
          { today }
        </Number>
        <Description>
          Hoy
        </Description>
      </Column>
      <Column>
        <Number fontSize='30px'>
          { all }
        </Number>
        <Description>
          Total
        </Description>
      </Column>
    </Row>
  </Card>
)

export default NumberCardComponent
