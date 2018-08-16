import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import moment from 'moment'
import Tickets from './Tickets'
import { USER } from '../chat-queries'

const Panel = styled.div`
  width: 35%;
  height: 100%;
  background-color: #FFF;
`

const Label = styled.div`
  width: 100%;
  font-family: 'Open Sans',sans-serif;
  letter-spacing: -.003em;
  line-height: 1.58;
  font-size: 18px;
`

export default ({ _id }) => {
  if (!_id) return <Panel>Select a user</Panel>
  return (
    <Query query={USER} variables={{ _id }}>
      {({ data, loading }) => {
        if (data && !loading) {
          console.log(data)
          return (
            <Panel>
              <div>
                <Label>Fullname: { data.user.fullname}</Label>
                <Label>Email: { data.user.email }</Label>
                <Label>@{ data.user.username }</Label>
                <Label>Role: { data.user.role }</Label>
                <Label>Status { data.user.status }</Label>
                <Label>CreatedAt: {moment(data.user.createdAt).format('MMM Do YY')} ({moment(data.user.createdAt).fromNow() })</Label>
                <Label>Accept Terms: { data.user.acceptTermsAndPrivacy ? 'SI' : 'NO' }</Label>
                <Label>Email Confirmed: { data.user.emailConfirmed ? 'SI' : 'NO' }</Label>
                <Label>countViewPro: { data.user.countViewPro }</Label>
                <Label>countViewSub: { data.user.countViewSub }</Label>
                <Label>countAttemptsPaymentFailed: { data.user.countAttemptsPaymentFailed }</Label>
              </div>
              <Tickets customer={data.user} />
            </Panel>
          )
        }
        return null
      }}
    </Query>
  )
}
