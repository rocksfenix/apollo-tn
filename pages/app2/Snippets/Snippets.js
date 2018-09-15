import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import InfiniteScroll from 'react-infinite-scroll-component'
import Highlight from 'react-highlight'
import Modal from '../Modal'
import Editor from './Editor'
import { SNIPPETS } from '../queries'

const Anima = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    left: translateX(0%);
  }
`

const Panel = styled.div`
  width: 100%;
  height: 100%;
  transition: left .2s;
  will-change: transform;
  animation: ${Anima} .2s ease-out;
  position: relative;
`

const MainPanel = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-left: 55px;
  padding-top: 55px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: rgba(0,0,0,0.9);
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
  border: ${p => p.active ? '1px solid #FFF' : '1px solid #5f5f67'};
  background: #232323;
`

class Code extends Component {
  render () {
    return (
      <pre>
        <code>
          {this.props.code}
        </code>
      </pre>
    )
  }
}

const BoxCode = styled.div`
  overflow: hidden;
  width: 100%;
  height: 145px;
  position: relative;
  color: #7aa8ab;
  user-select: none;
  filter: ${p => p.active ? 'grayscale(0)' : 'grayscale(1)'};

  & > pre > code {
    padding: 0;
    overflow: hidden;
  }

  & > pre {
    transition: transform .6s cubic-bezier(0.23, 1, 0.32, 1), opacity .1s cubic-bezier(0.23, 1, 0.32, 1);;
    will-change: transform, opacity;
    margin: 0;
    opacity: 1;
    overflow: hidden;
    padding: 3em;
    transform: perspective(100px) scale(1.07) rotate(-2deg) translateX(5px);
    transform: ${p => p.active ? 'perspective(0px) scale(1) rotate(0deg) translateX(0px)' : 'perspective(100px) scale(1.07) rotate(-2deg) translateX(5px)'};
  }

  :hover {
    filter: grayscale(0);
    & > pre {
      transform: perspective(0px) scale(1) rotate(0deg) translateX(0px);
      opacity: 1;
    }

    & > span {
      opacity: .6;
    }
  }
`

const InfoBox = styled.div`
  width: 100%;
  height: 40px;
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
  opacity: .7;
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
  </InfoBox>
)

const ShowIcon = styled.i`
  font-size: 40px;
  color: #FFF;
  position: absolute;
  top: 1em;
  right: .3em;
`

class Snippet extends Component {
  setSnippetInFocus = () => {
    this.props.setSnippetInFocus(this.props.snippet)
  }

  render () {
    const {snippet, snippetInFocus} = this.props
    const isActive = snippetInFocus._id === snippet._id

    return (
      <Box onClick={this.setSnippetInFocus} active={isActive}>
        <BoxCode active={isActive}>
          <Gradient />
          <Code code={snippet.code} />
          <SnippetInfo {...this.props.snippet} />
          { isActive ? <ShowIcon className='icon-arrow-right' /> : null }
        </BoxCode>
      </Box>
    )
  }
}

const LoadingBox = styled.div`
  width: 100%;
  height: 100px;
  display: ${p => p.show ? 'flex' : 'none'};
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 0;
  z-index: 5000;
`

const Spinner = styled.img`
  width: 120px;
`

class SnippetsComponent extends Component {
  state = { snippetInFocus: {}, showEditor: false }

  setSnippetInFocus = (snippetInFocus) => {
    document.getElementById('modal-root').style.display = 'block'
    this.setState({ snippetInFocus, showEditor: true })
    this.props.cancelTouch()
  }

  componentDidUpdate (prevProps) {
    if (this.props.tab !== 'snippets' && this.state.showEditor) {
      this.setState({ showEditor: false })
    }
  }

  hideEditor = () => {
    document.getElementById('modal-root').style.display = 'none'
    this.setState({ showEditor: false, snippetInFocus: {} })
    this.props.activeTouch()
  }

  render () {
    if (this.props.tab !== 'snippets') return null
    return (
      <MainPanel id='ScrollableSnippets'>
        <Panel>
          <Modal show={this.state.showEditor} >
            <Editor
              onTouchStart={e => { e.stopPropagation(); e.preventDefault() }}
              snippet={this.state.snippetInFocus}
              hideEditor={this.hideEditor}
            />
          </Modal>
          <Snippets>
            <Query query={SNIPPETS} variables={{ limit: 10, offset: 0 }}>
              {({ data, loading, error, fetchMore }) => {
                if (loading) return <div>Loading</div>
                if (error) return <div>Error: {error}</div>
                if (!data.snippets) return null

                return (
                  <InfiniteScroll
                    dataLength={data.snippets.items.length + 1}
                    next={() => {
                      fetchMore({
                        variables: {
                          offset: data.snippets.items.length
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev

                          // Filtramos duplicados
                          const items = [
                            ...prev.snippets.items,
                            ...fetchMoreResult.snippets.items
                          ]

                          return {
                            snippets: {
                              ...prev.snippets,
                              items,
                              hasMore: fetchMoreResult.snippets.hasMore
                            }
                          }
                        }
                      })
                    }}
                    hasMore={data.snippets.hasMore}
                    scrollableTarget='ScrollableSnippets'
                    style={{ overflow: 'hidden' }}
                    loader={(
                      <LoadingBox show={data.snippets.hasMore}>
                        <Spinner src='/static/ellipsis.svg' />
                      </LoadingBox>
                    )}
                  >
                    {data.snippets.items.map(snippet => (
                      <Snippet
                        key={snippet._id}
                        snippet={snippet}
                        setSnippetInFocus={this.setSnippetInFocus}
                        snippetInFocus={this.state.snippetInFocus}
                      />
                    ))}
                  </InfiniteScroll>
                )
              }}
            </Query>
          </Snippets>
        </Panel>
      </MainPanel>
    )
  }
}

export default SnippetsComponent
