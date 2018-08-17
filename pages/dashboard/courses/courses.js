import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import Search from './Search'
import CourseEditor from './CourseEditor'

const COURSES = gql`
 query allCourses($first: Int, $skip: Int, $text: String) {
    allCourses (first: $first, skip: $skip, text: $text) {
      courses {
        slug
        title
        _id
        isPublished
        isRecording
        duration
        createdAt
        cover {
          s100
        }
      }
      total
    }
  }
`

const CREATE_COURSE = gql`
  mutation newCourse($title: String!) {
    courseCreate(input: {
      title: $title
    }) {
      slug
      title
      _id
      isPublished
      isRecording
      duration
      createdAt
      cover {
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
  height: 60px;
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.published ? '#6bcf00' : '#dcdcdc'};
  display: inline-block;
`

class CoursesComponent extends Component {
  state = {
    isFetching: false,
    courses: [],
    total: null,
    itemsByPage: 10,
    showEditor: false,
    slugActive: null,
    mounted: false,
    firstFetch: false
  }

  componentDidMount () {
    this.setState({ mounted: true })
  }

  showEditor = (data) => {
    this.setState({ showEditor: true, slugActive: data.original.slug })
  }

  hideEditor = () => this.setState({ showEditor: false })

  columns = [
    {
      Header: 'Image',
      accessor: 'cover',
      Cell: row => {
        return (
          <Box>
            <Cover src={row.original.cover.s100} />
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
      accessor: 'isPublished',
      Cell: row => (
        <TimeAgo>{row.value} <Ball published={row.value} /></TimeAgo>
      )
    }
  ]

  fetchData = async (state) => {
    if (process.browser) {
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
    }
  }

  search = async (text) => {
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

  createCourse = async (text) => {
    this.setState({ isFetching: true })
    const result = await this.props.client.mutate({
      mutation: CREATE_COURSE,
      variables: { title: text }
    })

    // Actualizamos cache de Apollo
    const { allCourses } = this.props.client.cache.readQuery({
      query: COURSES,
      variables: { first: 10, skip: 0 }
    })

    this.props.client.cache.writeQuery({
      query: COURSES,
      variables: { first: 10, skip: 0 },
      data: {
        allCourses: {
          ...allCourses,
          courses: [ result.data.courseCreate, ...allCourses.courses ]
        }
      }
    })

    this.setState({ courses: [ result.data.courseCreate ], total: 1, isFetching: false })
  }

  render () {
    console.log('RENDER', this.props)
    if (!this.props.show) return null
    return (
      <Panel>
        <SearchBox>
          <Search
            onSearch={this.search}
            onCreate={this.createCourse}
          />
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

        <CourseEditor
          {...this.props}
          show={this.state.showEditor}
          hideEditor={this.hideEditor}
          slug={this.state.slugActive}
        />

      </Panel>
    )
  }
}

export default withApollo(CoursesComponent)
