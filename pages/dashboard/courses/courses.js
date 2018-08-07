import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import Link from 'next/link'
import Search from '../Search'
import CourseEditor from './CourseEditor'

const COURSES = gql`
 query allCourses($first: Int, $skip: Int, $text: String) {
    allCourses (first: $first, skip: $skip, text: $text) {
      courses {
        slug
        title
        _id
        cover {
          micro
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
  position: relative;
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

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SearchBox = styled.div`
width: 100%;
height: 100px;
display: flex;
align-items: center;
justify-content: center;
background-color: #0f141b;
`

const Cover = styled.img`
  width: 60px;
`
const Ball = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.published ? 'green' : 'orange'};
  display: inline-block;
`

export default class extends Component {
  state = {
    isFetching: false,
    courses: [],
    total: null,
    itemsByPage: 10,
    showEditor: false
  }

  showEditor = (data) => {
    this.setState({ showEditor: true })
    console.log(data)
  }

  hideEditor = () => this.setState({ showEditor: false })

  columns = [
    {
      Header: 'Image',
      accessor: 'cover',
      Cell: row => {
        return (
          <Box>
            <Cover src={row.original.cover.micro} />
          </Box>
        )
      }
    },
    {
      Header: 'Title',
      accessor: 'title',
      Cell: row => {
        return (
          <Box>
            <div onClick={() => this.showEditor(row)}>
              <a>{row.value}</a>
            </div>
          </Box>
        )
      }
    },
    {
      Header: 'Duration',
      accessor: 'duration',
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
    },
    {
      Header: 'Published',
      accessor: 'published',
      Cell: row => (
        <TimeAgo>{row.value} <Ball published={row.value} /></TimeAgo>
      )
    }
  ]

  pushData = (data) => {
    if (!this.state.total) {
      this.setState({
        courses: data.allCourses.courses,
        total: data.allCourses.total,
        isFetching: false
      })
    }
  }

  fetchData = async (state, instance) => {
    const skip = state.page * state.pageSize

    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: COURSES,
      variables: { first: state.pageSize, skip }
    })

    this.setState({
      courses: result.data.allCourses.courses,
      total: result.data.allCourses.total,
      isFetching: false,
      itemsByPage: state.pageSize
    })

    // console.log(result)
    // https://github.com/howtographql/react-apollo/blob/master/src/components/LinkList.js
  }

  searchUser = async (text) => {
    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: COURSES,
      variables: {
        first: this.state.itemsByPage,
        skip: 0,
        text
      }
    })

    this.setState({
      courses: result.data.allCourses.courses,
      total: result.data.allCourses.total,
      isFetching: false
    })
  }

  render () {
    if (!this.props.show) {
      return null
    }
    return (
      <Query query={COURSES} variables={{ first: 10, skip: 0 }}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          if (data.allCourses) {
            this.pushData(data)
          }

          if (!this.state.total) return null
          return (
            <Panel>
              <SearchBox>
                <Search onSeach={this.searchUser} />
              </SearchBox>
              <ReactTable
                manual
                loading={this.state.isFetching}
                data={this.state.courses}
                columns={this.columns}
                defaultPageSize={this.state.itemsByPage}
                onFetchData={this.fetchData}
                pages={Math.ceil(this.state.total / this.state.itemsByPage, 10)}
              />
              <CourseEditor show={this.state.showEditor} hideEditor={this.hideEditor}/>
            </Panel>
          )
        }}
      </Query>
    )
  }
}
