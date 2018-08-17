import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'

const StatsBlockBox = styled.div`
  width: 90px;
  padding: 0 10px 0 10px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`
const StastBlockNum = styled.div`
  width: 100%;
  height: 55px;
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  color: #FFF;
  border-bottom: 1px solid #efefef;
`

const StastBlockText = styled.div`
  width: 90px;
  font-size: 12px;
  color: #FFF;
  text-align: center;
  height: 50px;
  padding-top: 3px;
`

export default ({ number, label }) => (
  <StatsBlockBox>
    <StastBlockNum>{ number }</StastBlockNum>
    <StastBlockText>{ label }</StastBlockText>
  </StatsBlockBox>
)
