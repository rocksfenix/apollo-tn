import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import LessonEditor from './LessonEditor'
import Search from '../Search'
import getTechIcon from '../../../util/getTechIcon'

const LESSONS = gql`
 query allLessons($first: Int, $skip: Int, $text: String) {
    allLessons (first: $first, skip: $skip, text: $text) {
      lessons {
        slug
        title
        _id
        role
        tech
        isTranscriptionPublic
        isPublished
        duration
        createdAt
        screenshot {
          s100
        }
      }
      total
    }
  }
`

const LESSON_CREATE = gql`
 mutation lessonCreate($title: String!) {
  lessonCreate (input: { title: $title }) {
      slug
      title
      _id
      role
      tech
      isTranscriptionPublic
      isPublished
      duration
      createdAt
      screenshot {
        s100
      }
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
  height: 30px;
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
const TechBox = styled.div`
  width: 30px;
  height: 30px;
  background-color: #FFF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
  position: relative;
  z-index: 10;
  box-shadow: 0 0 21px rgb(223, 223, 223);
`

const TechImage = styled.img`
  width: 50%;
`

const Ball = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.published ? '#6bcf00' : '#dcdcdc'};
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
      Header: 'Role',
      accessor: 'role',
      Cell: row => (
        <TimeAgo>{row.value}</TimeAgo>
      )
    },
    {
      Header: 'Tech',
      accessor: 'tech',
      Cell: row => (
        <Box>
          <TechBox>
            <TechImage src={getTechIcon(row.value)} />
          </TechBox>
        </Box>
      )
    },
    {
      Header: 'Published',
      accessor: 'isPublished',
      Cell: row => (
        <TimeAgo>{row.value} <Ball published={row.value} /></TimeAgo>
      )
    },
    {
      Header: 'Transcription Public',
      accessor: 'isTranscriptionPublic',
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

  createLesson = async (title) => {
    const result = await this.props.client.mutate({
      mutation: LESSON_CREATE,
      variables: { title }
    })

    // Actualizamos cache de Apollo
    const { allLessons } = this.props.client.cache.readQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 }
    })

    this.props.client.cache.writeQuery({
      query: LESSONS,
      variables: { first: 10, skip: 0 },
      data: {
        allLessons: {
          ...allLessons,
          lessons: [ result.data.lessonCreate, ...allLessons.lessons ]
        }
      }
    })

    this.setState({ lessons: [ result.data.lessonCreate ], total: 1, isFetching: false })
  }

  render () {
    if (!this.props.show) return null
    return (
      <Query query={LESSONS} variables={{ first: 10, skip: 0 }}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) return '...Loading'
          if (error) return `Error!: ${error}`
          if (!data) return null
          return (
            <Panel>
              <LessonEditor
                show={this.state.showEditor}
                hideEditor={this.hideEditor}
                slug={this.state.activeLessonSlug}
              />
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
                  onCreate={this.createLesson}
                />
              </SearchBox>
              <ReactTable
                manual
                loading={loading}
                data={data.allLessons.lessons}
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
                pages={Math.ceil(data.allLessons.total / 10, 10)}
              />
            </Panel>
          )
        }}
      </Query>
    )
  }
}
