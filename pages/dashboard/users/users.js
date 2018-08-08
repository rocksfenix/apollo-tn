import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import Search from '../Search'

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
        avatar {
          s100
        }
      }
      total
    }
  }

`

const Panel = styled.div`
  width: 100%;
  height: 100vh;
  background-color: yellow;
  background: #fbfbfb;
  overflow-y: auto;
  overflow-x: hidden;
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

const Avatar = styled.img`
  width: 35px;
  border-radius: 50%;
  margin: 16px;
`

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
    userByPage: 10
  }

  columns = [
    {
      Header: 'Name',
      accessor: 'fullname',
      Cell: row => {
        return (
          <Link onClick={() => this.openUser(row.original)}>
            <LeftBlock>
              <Avatar src={row.original.avatar.s100} />
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

  pushData = (data) => {
    if (!this.state.total) {
      this.setState({
        users: data.allUsers.users,
        total: data.allUsers.total,
        isFetching: false
      })
    }
  }

  fetchData = async (state, instance) => {
    const skip = state.page * state.pageSize

    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: USERS,
      variables: { first: state.pageSize, skip }
    })

    this.setState({
      users: result.data.allUsers.users,
      total: result.data.allUsers.total,
      isFetching: false,
      userByPage: state.pageSize
    })

    // console.log(result)
    // https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js
  }

  searchUser = async (text) => {
    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: USERS,
      variables: {
        first: this.state.userByPage,
        skip: 0,
        text
      }
    })

    this.setState({
      users: result.data.allUsers.users,
      total: result.data.allUsers.total,
      isFetching: false
    })
  }

  render () {
    if (!this.props.show) {
      return null
    }
    return (
      <Query query={USERS} variables={{ first: 10, skip: 0 }}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          if (data.allUsers) {
            this.pushData(data)
          }

          if (!this.state.total) return null
          return (
            <Panel>
              <SearchBox>
                <Search onSeach={this.searchUser}/>
              </SearchBox>
              <ReactTable
                manual
                loading={this.state.isFetching}
                data={this.state.users}
                columns={this.columns}
                defaultPageSize={this.state.userByPage}
                onFetchData={this.fetchData}
                pages={Math.ceil(this.state.total / this.state.userByPage, 10)}
              />
            </Panel>
          )
        }}
      </Query>
    )
  }
}
