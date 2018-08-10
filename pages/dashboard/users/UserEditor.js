import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import { Notification } from 'react-notification'
import TextField from '../../../components/TextField'
import Multioption from '../../../components/Multioption'
import Textarea from '../../../components/Textarea'
import ColorField from '../../../components/ColorField'
import ToggleField from '../../../components/ToggleField'
import Avatar from './Avatar'

const USER = gql`
  query user ($_id: ID!) {
    user(_id: $_id) {
      _id
      fullname
      slug
      email
      username
      role
      status
      emailConfirmed
      acceptTermsAndPrivacy
      acceptTermsAndPrivacyUpdated
      createdAt
      countViewPro
      countViewSub
      countAttemptsPaymentFailed
      avatar {
        s100
      }
    }
  }
`

const animation = keyframes`
  0%{
    transform: scale(.9);
    opacity: 0;
  }
  100%{
    transform: scale(1);
    opacity: 1;
  }
`

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-right: 52px;
  background-color: rgba(0, 0, 0, 0.98);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 900;
  animation: .3s ease-in-out ${animation};
`
const Buttons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 33px;
  background-color: #060507;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #000;
  user-select: none;
`

const ButtonSave = styled.button`
  background-color: #332e36;
  color: #FFF;
  border: 1px solid transparent;
  margin: 0 1em;
  padding: 0 1.5em;
  border-radius: 3px;
  font-family: Roboto;
  font-size: 15px;
  cursor: pointer;
  transition: all .2s ease-out;
  outline: none;

  :hover {
    background: #3b96c0;
  }
`

const Subpanel = styled.div`
  width: ${p => p.width || '30%'};
  height: 100%;
  background-color: #FFF;
  top: 55px;
  position: relative;
  border-radius: 4px;
`

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Column = styled.div`
  width: 50%;
`

const Fields = styled.div`
  width: 90%;
  padding-top: 1em;
  margin: 0 auto;
`

const StatsBlockBox = styled.div`
  width: 90px;
  padding: 0 10px 0 10px;
  height: 100%;
  background-color: #FFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`
const StastBlockNum = styled.div`
  width: 100%;
  height: 70px;
  font-size: 50px;
  font-family: Roboto;
  font-weight: bold;
  text-align: center;
  color: #24314e;
  border-bottom: 1px solid #efefef;
`

const StastBlockText = styled.div`
  width: 100px;
  font-size: 12px;
  color: gray;
  text-align: center;
`

const StatsBox = styled.div`
  width: 80%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`

const StatsBlock = ({ number, label }) => (
  <StatsBlockBox>
    <StastBlockNum>{ number }</StastBlockNum>
    <StastBlockText>{ label }</StastBlockText>
  </StatsBlockBox>
)

class UserEditor extends Component {
  state = {
    user: {
      _id: '',
      fullname: '',
      email: '',
      role: '',
      avatar: {}
    }
  }
  async componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.userId !== prevProps.userId) {
      const result = await this.props.client.query({
        query: USER,
        variables: { _id: this.props.userId }
      })
      console.log(result)
      this.setState({ user: result.data.user })
    }
  }

  onChange = (key, value) => {
    this.setState(state => ({
      ...state,
      user: {
        ...state.user,
        [key]: value
      }
    }))
  }

  render () {
    if (!this.props.show || !this.props.userId) return null
    return (
      <Panel>
        <Buttons>
          <ButtonSave onClick={this.saveChanges}>Save</ButtonSave>
          <ButtonSave onClick={this.props.hideEditor}>Close</ButtonSave>
          <ButtonSave onClick={() => console.log(JSON.stringify(this.state, null, 2))}>Debugg</ButtonSave>
        </Buttons>
        <Subpanel width='35%'>
          <Fields>
            <Avatar src={this.state.user.avatar.s100} />
            <TextField
              label='fullname'
              keyName='fullname'
              size='medium'
              onChange={this.onChange}
              value={this.state.user.fullname}
            />
            <TextField
              label='email'
              keyName='email'
              size='medium'
              onChange={this.onChange}
              value={this.state.user.email}
            />
            <Multioption
              label='role'
              keyName='role'
              active={this.state.user.role}
              options={[
                { value: 'pro' },
                { value: 'free' },
                { value: 'public' }
              ]}
              onChange={this.onChange}
            />
            <Multioption
              label='status'
              keyName='status'
              active={this.state.user.status}
              options={[
                { value: 'active' },
                { value: 'hold' }
              ]}
              onChange={this.onChange}
            />
            <StatsBox>
              <StatsBlock number={this.state.user.countViewPro} label='PRO' />
              <StatsBlock number={this.state.user.countViewSub} label='Subscription' />
              <StatsBlock number={this.state.user.countAttemptsPaymentFailed} label='Payments attemps' />
            </StatsBox>
          </Fields>
        </Subpanel>
        <Subpanel width='28%' />
        <Subpanel width='28%' />
      </Panel>
    )
  }
}

export default withApollo(UserEditor)