import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import Search from '../Search'
import UserEditor from './UserEditor'

const USERS = gql`
 query allUsersQuery($first: Int, $skip: Int, $text: String) {
    allUsers (first: $first, skip: $skip, text: $text) {
    users {
        _id
        slug
        fullname
        email
        role
        createdAt
        isConnected
        connectionDate
        avatar {
          s100
        }
      }
      total
    }
  }
`

const ON_USER_CONNECTION = gql`
  subscription {
    onChangeConnection {
      status
      user {
        _id
        slug
        fullname
        email
        role
        createdAt
        isConnected
        connectionDate
        avatar {
          s100
        }
      }
    }
  }
`
// display: flex;
// flex-direction: column;
// align-items: center;
// justify-content: space-around;

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-right: 52px;
  z-index: 1000;
  transition: all .2s ease-in-out;
  overflow: hidden;
  opacity: ${p => p.show ? '1' : '0'};
  transform: ${p => p.show ? 'scale(1)' : 'scale(.93)'};
  z-index: ${p => p.show ? '1000' : '-1'};
`

const TimeAgo = styled.div`
  font-size: 13px;
  color: #666;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-weight: 100;
`

const AvatarBox = styled.div`
  width: ${props => props.size || '35px'};
  height: ${props => props.size || '35px'};
  position: relative;
`
const AvatarBall = styled.div`
  background-color: ${p => p.isConnected ? '#32d412' : '#c6c6c6'};
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid #FFF;
  position: absolute;
  top: 2px;
  right: -3px;
  box-shadow: -6px 3px 10px rgba(0, 0, 0, 0.61);
`

const AvatarImage = styled.div`
  width: ${props => props.size || '35px'};
  height: ${props => props.size || '35px'};
  border-radius: 50%;
  background: url(${props => props.src});
  background-size: cover;
`

const Avatar = ({ src, isConnected }) => (
  <AvatarBox>
    <AvatarImage src={src} />
    <AvatarBall isConnected={isConnected} />
  </AvatarBox>
)

const Center = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Role = styled.span`
  background: ${props => {
    if (props.type === 'admin') { return 'orange' }
    if (props.type === 'pro') { return '#0f0080' }
    if (props.type === 'free') { return '#33b2ff' }
  }};
  padding: 5px 20px;
  border-radius: 5px;
  font-family: Roboto;
  font-size: 12px;
  color: #FFF;
  display: inline-block;
`

const UserRoleTag = ({ role }) => (
  <Center>
    <Role type={role}>
      {role}
    </Role>
  </Center>
)

const LeftBlock = styled.div`
  width: 300px;
  height: 65px;
  display: flex;
  align-items: center;
  padding-left: 20px;
`
const Link = styled.a`
  text-decoration: none;
  color: #322e48;
  opacity: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.1;
    color: #5c5ed0;
  }
`

const SearchBox = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f141b;
`
export default class extends Component {
  state = {
    isFetching: false,
    users: [],
    total: null,
    userByPage: 10,
    showEditor: false
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'fullname',
      Cell: row => {
        return (
          <Link>
            <LeftBlock onClick={() => this.showEditor(row)}>
              <Avatar
                src={row.original.avatar.s100}
                isConnected={row.original.isConnected}
              />
              { row.value }
            </LeftBlock>
          </Link>
        )
      }
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: row => (
        <UserRoleTag role={row.value} />
      )
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: row => (
        <TimeAgo>{row.value}</TimeAgo>
      )
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: row => (
        <TimeAgo>{moment(row.value).fromNow()}</TimeAgo>
      )
    }
  ]

  showEditor = (row) => {
    this.setState({
      showEditor: true,
      usedId: row.original._id
    })
  }

  hideEditor = () => this.setState({ showEditor: false })

  sub = false

  render () {
    return (
      <Query query={USERS} variables={{ first: 10, skip: 0 }}>
        {({ loading, error, data, subscribeToMore, fetchMore }) => {
          if (loading) return '...Loading'
          if (error) return `Error!: ${error}`

          if (!this.sub && process.browser) {
            this.sub = subscribeToMore({
              document: ON_USER_CONNECTION,
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.onChangeConnection) return prev

                console.log(subscriptionData.data.onChangeConnection)
                return {
                  allUsers: {
                    ...prev.allUsers,
                    users: prev.allUsers.users.map(user =>
                      user._id === subscriptionData.data.onChangeConnection.user._id
                        ? subscriptionData.data.onChangeConnection.user
                        : user
                    )
                  }
                }
              }
            })
          }

          return (
            <Panel show={this.props.show}>
              <SearchBox>
                <Search
                  onSearch={(text) => {
                    fetchMore({
                      variables: {
                        first: 10,
                        skip: 0,
                        text
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev
                        return fetchMoreResult
                      }
                    })
                  }}
                />
              </SearchBox>
              <ReactTable
                manual
                loading={loading}
                data={data.allUsers.users}
                columns={this.columns}
                defaultPageSize={10}
                onFetchData={(table) => {
                  fetchMore({
                    variables: { first: table.pageSize, skip: 10 * table.page },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev
                      return fetchMoreResult
                    }
                  })
                }}
                pages={Math.ceil(data.allUsers.total / 10, 10)}
              />

              <UserEditor
                show={this.state.showEditor}
                hideEditor={this.hideEditor}
                userId={this.state.usedId}
              />
            </Panel>
          )
        }}
      </Query>
    )
  }
}
