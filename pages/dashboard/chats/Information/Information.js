import React, {Component} from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import moment from 'moment'
import Tickets from '../../../../components/Tickets'
import { USER } from '../chat-queries'
import MemberStats from '../../../../components/MemberStats'

const Panel = styled.div`
  width: 35%;
  height: 100%;
  background-color: #FFF;
  border-left: 1px solid #d5d5d5;
`

const AvatarInfo = styled.div`
  width: 100%;
  border-bottom: 4px solid #ecebf1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: .6em 0;
`

const Avatar = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border-radius: 50%;
  background: url(${props => props.src});
  background-size: cover;
`

const DataName = styled.div`
  width: 70%;
`

const Fullname = styled.div`
  font-size: 20px;
`

const Email = styled.div`
  font-size: 13px;
  color: #aeaeae;
  font-weight: 100;
`

const Role = styled.span`
  padding: 3px 20px;
  background: #1c45ad;
  color: #FFF;
  border-radius: 20px;
  font-size: 15px;
`

const Subpanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 330px;
`

const Tabs = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const Tab = styled.div`
  min-width: 150px;
  max-width: 200px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p => p.active ? 'rgba(0,129,255,1)' : 'transparent'};
  color: ${p => p.active ? '#FFF' : '#222'};
`

const View = styled.div`
  width: 100%;
  flex: 2;
  overflow: hidden;
  position: relative;
`

const Information = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(56deg, #00287f, #006fba);
  position: absolute;
  top: 0;
  left: ${p => p.active ? '0' : '-100%'};
  transition: left .2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Billing = styled.div`
  width: 100%;
  height: 100%;
  background: blue;
  position: absolute;
  top: 0;
  right: ${p => p.active ? '0' : '-100%'};
  transition: right .2s ease-out;
`

const SignupAt = styled.span`
  font-size: 10px;
  color: #717171;
  padding: 0 1em;
`

export default class extends Component {
  state = { tab: 'info' }

  showBilling = () => this.setState({ tab: 'billing' })

  showInfo = () => this.setState({ tab: 'info' })

  render () {
    const { _id } = this.props
    const { tab } = this.state

    if (!_id) return <Panel>... Loading</Panel>
    return (
      <Query query={USER} variables={{ _id }}>
        {({ data, loading }) => {
          if (loading) return <Panel>Loading...</Panel>
          if (data && !loading) {
            return (
              <Panel>
                <AvatarInfo>
                  <Avatar src={data.user.avatar.s100} />
                  <DataName>
                    <Fullname>{data.user.fullname}</Fullname>
                    <Email>{data.user.email}</Email>
                    <Role>Ninja {data.user.role} <i className='icon-thunder-4' /></Role>
                    <SignupAt>({moment(data.user.createdAt).fromNow() })</SignupAt>
                  </DataName>
                </AvatarInfo>
                <Subpanel>
                  <Tabs>
                    <Tab active={tab === 'info'} onClick={this.showInfo}><i className='icon-credential' /></Tab>
                    <Tab active={tab === 'billing'} onClick={this.showBilling}><i className='icon-billing' /></Tab>
                  </Tabs>
                  <View>
                    <Information active={tab === 'info'}>
                      <MemberStats user={data.user} />
                    </Information>
                    <Billing active={tab === 'billing'}>Billing here!</Billing>
                  </View>
                </Subpanel>
                <Tickets customer={data.user} />
              </Panel>
            )
          }
          return null
        }}
      </Query>
    )
  }
}
