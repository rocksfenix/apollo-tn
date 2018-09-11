import React, {Component} from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import InfiniteScroll from 'react-infinite-scroll-component'
import Highlight from 'react-highlight'
import Modal from '../Modal'
import Editor from './Editor'

const SNIPPETS = gql`
  query snippets($limit: Int, $offset: Int) {
    snippets(limit: $limit, offset: $offset) @connection(key: "snippets") {
      items {
        _id
        lang
        filename
        code
        author
        lessonTitle
        courseTitle
        lessonSlug
        courseSlug
      }
      hasMore
    }
  }
`

const Panel = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 55px;
  padding-top: 55px;
  background-color: red;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 2000;
`

const Snippets = styled.ul`
  margin: 0;
  padding: 0;
  background: #232323;
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
`

const Box = styled.li`
  list-style: none;
  font-size: 6px;
  margin: 1em 0;
  padding: 0;
  overflow: hidden;
  height: 140px;
  border: 1px solid #FFF;
  background: #232323;
`

class Code extends Component {
  render () {
    return (
      <Highlight>
        {this.props.code}
      </Highlight>
    )
  }
}

const BoxCode = styled.div`
  overflow: hidden;
  width: 100%;
  height: 145px;
  position: relative;

  & > pre > code {
    padding: 0;
    overflow: hidden;
  }

  & > pre {
    transition: transform .6s cubic-bezier(0.23, 1, 0.32, 1), opacity .1s cubic-bezier(0.23, 1, 0.32, 1);;
    will-change: transform, opacity;
    margin: 0;
    opacity: .9;
    overflow: hidden;
    padding: 3em;
  }

  :hover {
    & > pre {
      transform: perspective(100px) scale(1.07) rotate(-2deg) translateX(5px);
      opacity: 1;
    }

    & > span {
      opacity: .6;
    }
  }
`

const InfoBox = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.16);
  background: linear-gradient(90deg,rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.38));
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  z-index: 200;
`

const Gradient = styled.span`
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  opacity: .2;
  background: radial-gradient(rgba(0,0,0,0.03),rgba(0, 0, 0, 0.52));
`

const InfoText = styled.div`
  color: #FFF;
  font-size: 13px;
  padding: 0 .5em;
`

const CourseImg = styled.img`
  width: 20px;
`

const Filename = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const SnippetInfo = ({ filename }) => (
  <InfoBox>
    <Filename>
      <CourseImg src='/static/react.svg' />
      <InfoText>{ filename }</InfoText>
    </Filename>
    {/* <CourseImg src='https://dxpdcvj89hnue.cloudfront.net/cover/rxjs-elemental-s50' /> */}
  </InfoBox>
)

class Snippet extends Component {
  setSnippetInFocus = () => {
    this.props.setSnippetInFocus(this.props.snippet)
  }

  render () {
    const {snippet} = this.props
    // if (process.browser) {
    //   const r = require('react-ace')
    //   console.log(r)
    // }
    return (
      <Box onClick={this.setSnippetInFocus}>
        <BoxCode>
          <Gradient />
          <Code code={snippet.code} />
          <SnippetInfo {...this.props.snippet} />
        </BoxCode>
      </Box>
    )
  }
}

class SnippetsComponent extends Component {
  state = { snippetInFocus: {}, showEditor: false }

  setSnippetInFocus = (snippetInFocus) => this.setState({ snippetInFocus, showEditor: true })

  componentDidUpdate (prevProps) {
    if (this.props.tab !== 'snippets' && this.state.showEditor) {
      this.setState({ showEditor: false })
    }
  }

  hideEditor = () => this.setState({ showEditor: false })

  render () {
    if (this.props.tab !== 'snippets') return null
    return (
      <Panel>
        <Modal show={this.state.showEditor} >
          <Editor
            snippet={this.state.snippetInFocus}
            hideEditor={this.hideEditor}
          />
        </Modal>
        <Snippets>
          { this.state.snippetInFocus._id }
          <Query query={SNIPPETS} variables={{ limit: 10, offset: 0 }}>
            {({ data, loading, error, fetchMore }) => {
              if (loading) return <div>Loading</div>
              if (error) return <div>Error: {error}</div>
              if (!data.snippets) return null
              return (
                <InfiniteScroll
                  dataLength={data.snippets.items.length + 1}
                  next={() => {
                    // fetchMore({
                    //   variables: {
                    //     offset: data.snippets.items.length
                    //   },
                    //   updateQuery: (prev, { fetchMoreResult }) => {
                    //     if (!fetchMoreResult) return prev

                    //     // Filtramos duplicados
                    //     const items = [
                    //       ...prev.snippets.items,
                    //       ...fetchMoreResult.snippets.items
                    //     ]

                    //     return {
                    //       snippets: {
                    //         ...prev.snippets,
                    //         items,
                    //         hasMore: fetchMoreResult.snippets.hasMore
                    //       }
                    //     }
                    //   }
                    // })
                  }}
                  hasMore={data.snippets.hasMore}
                  scrollableTarget='scrollableHistory'
                  style={{ overflow: 'hidden' }}
                  loader={<h1>Loading</h1>}
                >
                  {data.snippets.items.map(snippet => (
                    <Snippet key={snippet._id} snippet={snippet} setSnippetInFocus={this.setSnippetInFocus} />
                  ))}
                </InfiniteScroll>
              )
            }}
          </Query>
        </Snippets>
      </Panel>
    )
  }
}

export default SnippetsComponent
