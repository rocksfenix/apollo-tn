import React from 'react'
import styled from 'styled-components'
import Stats from './Stats'

const Information = styled.div`
  width: 100%;
  min-height: 300px;
  background: linear-gradient(56deg, #00287f, #006fba);
  background: linear-gradient(56deg,#0f0f11,#7b8992);
  transition: left .2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Confirmations = styled.div`
  width: 35%;
  padding: 0 .8em;
`

const ConfBox = styled.div`
  display: flex;
  align-items: center;
  padding: .2em 0;
  justify-content: flex-start;
`
const Row = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
`
const IconConf = styled.i`
  font-size: 8px;
  color: #FFF;
`
const Ball = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${p => p.active ? '#abb3df' : '#ffa6c2'};
  display: flex;
  justify-content: center;
  align-items: center;
`
const StatsBox = styled.div`
  width: 65%;
  height: 93%;
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
`

const Label = styled.div`
  color: #FFF;
  font-size: 12px;
  margin-left: .5em;
`

const Conf = ({ text, active }) => {
  return (
    <ConfBox>
      <Ball active={active}>
        { active ? <IconConf className='icon-success' /> : <IconConf className='icon-cross' />}
      </Ball>
      <Label>{ text }</Label>
    </ConfBox>
  )
}

export default ({ user }) => (
  <Information>
    <Confirmations>
      <Conf text='Status' active={user.status} />
      <Conf text='Email Confirmed' active={user.emailConfirmed} />
      <Conf text='Accept Terms & Policy' active={user.acceptTermsAndPrivacy} />
    </Confirmations>
    <StatsBox>
      <Row>
        <Stats number={user.countViewPro} label='PRO' />
        <Stats number={user.countViewSub} label='Subscription' />
        <Stats number={user.countAttemptsPaymentFailed} label='Payments attemps' />
      </Row>
      <Row>
        <Stats number='32' label='Lessons Watched' />
        <Stats number='126' label='Points' />
        <Stats number='425' label='Minutes Watched' />
      </Row>
    </StatsBox>
  </Information>
)
