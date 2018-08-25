import styled from 'styled-components'
import React, {Component} from 'react'
import moment from 'moment'
import { Query, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import ReactTable from 'react-table'
import Search from '../Search'
import CourseEditor from './CourseEditor'
import getTechIcon from '../../../util/getTechIcon'
import Panel from '../Panel'

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
        tech
        color
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
        tech
        color
        cover {
          s100
        }
      }
  }
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
  height: 100px;
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

const CoverBox = styled.div`
  width: 75px;
  height: 75px;
  background-color: #FFF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
  position: relative;
  z-index: 10;
  box-shadow: ${p => `0 0 180px 2px ${p.color}`};
`

const Cover = styled.img`
  width: 70%;
`
const Ball = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.published ? '#6bcf00' : '#dcdcdc'};
  display: inline-block;
`
//     box-shadow: 0 0 21px red;
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

class CoursesComponent extends Component {
  state = {
    showEditor: false,
    slugActive: null
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
          <Box onClick={() => this.showEditor(row)}>
            <CoverBox color={row.original.color}>
              <Cover src={row.original.cover.s100} />
            </CoverBox>
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
    }
  ]

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
    // if (!this.props.show) return null
    return (
      <Panel show={this.props.show}>
        <Query query={COURSES} variables={{ first: 10, skip: 0 }}>
          {({ data, loading, error, fetchMore, networkStatus }) => {
            if (loading) return null
            if (error) return `Error!: ${error}`
            if (networkStatus === 4) return 'Refetching!'
            if (data) {
              return (
                <div>
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
                      onCreate={this.createCourse}
                    />
                  </SearchBox>
                  <ReactTable
                    manual
                    loading={loading}
                    data={data.allCourses.courses}
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
                    pages={Math.ceil(data.allCourses.total / 10, 10)}
                  />
                </div>
              )
            }
            return null
          }}
        </Query>
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
