import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import LessonEditor from './LessonEditor'
import Search from '../Search'

const LESSONS = gql`
 query allLessons($first: Int, $skip: Int, $text: String) {
    allLessons (first: $first, skip: $skip, text: $text) {
      lessons {
        slug
        title
        _id
        screenshot {
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
    lessons: [],
    total: null,
    itemsByPage: 30,
    showEditor: false,
    activeLessonSlug: undefined
  }

  columns = [
    {
      Header: 'Screenshot',
      accessor: 'screenshot',
      Cell: row => {
        return (
          <Box>
            <Cover src={row.original.screenshot.s100} />
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
      Header: 'UID',
      accessor: 'uid',
      Cell: row => (
        <TimeAgo>{row.value}</TimeAgo>
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
        lessons: data.allLessons.lessons,
        total: data.allLessons.total,
        isFetching: false
      })
    }
  }

  fetchData = async (state, instance) => {
    const skip = state.page * state.pageSize

    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: LESSONS,
      variables: { first: state.pageSize, skip }
    })

    this.setState({
      lessons: result.data.allLessons.lessons,
      total: result.data.allLessons.total,
      isFetching: false,
      itemsByPage: state.pageSize
    })
  }

  searchUser = async (text) => {
    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: LESSONS,
      variables: {
        first: this.state.itemsByPage,
        skip: 0,
        text
      }
    })

    this.setState({
      lessons: result.data.allLessons.lessons,
      total: result.data.allLessons.total,
      isFetching: false
    })
  }

  showEditor = (row) => this.setState({
    showEditor: true,
    activeLessonSlug: row.original.slug
  })

  hideEditor = () => this.setState({ showEditor: false })

  render () {
    if (!this.props.show) {
      return null
    }
    return (
      <Query query={LESSONS} variables={{ first: 10, skip: 0 }}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          if (data.allLessons) {
            this.pushData(data)
          }

          if (!this.state.total) return null
          return (
            <Panel>
              <LessonEditor
                show={this.state.showEditor}
                hideEditor={this.hideEditor}
                slug={this.state.activeLessonSlug}
              />
              <SearchBox>
                <Search onSeach={this.searchUser} />
              </SearchBox>
              <ReactTable
                manual
                loading={this.state.isFetching}
                data={this.state.lessons}
                columns={this.columns}
                defaultPageSize={this.state.itemsByPage}
                onFetchData={this.fetchData}
                pages={Math.ceil(this.state.total / this.state.itemsByPage, 10)}
              />
            </Panel>
          )
        }}
      </Query>
    )
  }
}
