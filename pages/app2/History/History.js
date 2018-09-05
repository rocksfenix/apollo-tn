import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import ItemHistory from './ItemHistory'
import { Query } from 'react-apollo'
import { HISTORY } from '../queries'

const Panel = styled.div`
  width: ${p => p.isMobile ? '100%' : '355px'};
  height: ${p => p.height};
  padding-left: 55px;
  display: ${p => p.size === 'playing' ? 'none' : 'flex'};
  position: fixed;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 0;
  top: 0;
  background-color: #FFF;
  transition: transform .2s cubic-bezier(1,0,0,1);
  transform: ${p => p.show ? 'translateX(0%)' : 'translateX(-100%)'};
  justify-content: ${p => p.expanded ? 'flex-start' : 'center'};
  will-change: transform, height;
  border-right: 1px solid whitesmoke;
  overflow:  ${p => p.expanded ? 'auto' : 'hidden'};
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.06);

  @media screen and (orientation: landscape) and (max-width: 900px) {
    height: ${p => {
    if (p.size === 'mini') return '55px'
    if (p.size === 'full') return p.height
  }};
  }

   /* width */
   ::-webkit-scrollbar {
      width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #FFF
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: #ecebf1;
      border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      background: black; 
  }
`

const HistoryItems = ({ show, size, historyItems, onChangeCourse }) => {
  if (show) {
    return (
      <React.Fragment>
        {historyItems.map(item => (
          <ItemHistory item={item} size={size} animated onChangeCourse={onChangeCourse} />
        ))}
      </React.Fragment>
    )
  }
  return null
}

const LoadingBox = styled.div`
  width: 100%;
  height: 100px;
  display: ${p => p.show ? 'flex' : 'none'};
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
`

const Spinner = styled.img`
  width: 120px;
`

class HistoryComponent extends Component {
  // shouldComponentUpdate (nextProps, nextState) {
  //   return nextProps.tab !== this.props.tab
  // }

  render () {
    const { show, tab, playing, course, lesson, showMobileNav, isMobile } = this.props
    // Existen solo 3 tamaños diferentes
    // full - mini - playing
    // show indica si esta visible

    // if (!show) return null
    let height = '55px'

    const expanded = tab === 'history'

    // Tamaños
    let size = 'mini'
    if (tab === 'history') size = 'full'
    if (playing && tab === 'course') size = 'playing'

    // Si esta expandido el Height es del 100vh
    if (expanded) height = '100vh'

    // Si la tab es course y hay curso activo el height es 155px
    if (playing && tab === 'course') height = '155px'

    let _show = show

    // Se oculta si es mobile y esta
    // ocula la barra de navegacion
    if (isMobile && !showMobileNav) _show = false

    const currentItem = {
      _id: lesson._id + '1-',
      author: lesson.author,
      lesson: lesson._id,
      course: course._id,
      watchedAt: Date.now(),
      tech: lesson.tech,
      lessonTitle: lesson.title,
      courseTitle: course.title,
      courseSlug: course.slug,
      lessonSlug: lesson.slug
    }

    return (
      <Query query={HISTORY} variables={{ limit: 20, offset: 0 }}

      >
        {({ data, error, loading, fetchMore, updateQuery }) => {
          if (loading) return <h1>Loading</h1>
          if (error) return <h1>error {error}</h1>

          return (
            <Panel
              id='scrollableHistory'
              show={_show}
              height={height}
              expanded={expanded}
              isMobile={isMobile}
              size={size}
            >
              <InfiniteScroll
                dataLength={data.history.length + 1}
                next={() => {
                  fetchMore({
                    variables: {
                      offset: data.history.items.length
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev
                      // debugger
                      return {
                        ...prev,
                        history: {
                          ...prev.history,
                          items: [
                            ...fetchMoreResult.history.items,
                            ...prev.history.items
                          ],
                          hasMore: fetchMoreResult.history.hasMore
                        }
                      }
                    }
                  })
                }}
                hasMore={data.history.hasMore}
                scrollableTarget='scrollableHistory'
                style={{ overflow: 'hidden' }}
                loader={
                  (
                    <LoadingBox show={data.history.hasMore}>
                      <Spinner src='/static/ellipsis.svg' />
                    </LoadingBox>
                  )
                }
              >
                <ItemHistory item={currentItem} size={size} isMobile={isMobile} />
                <HistoryItems show={expanded} historyItems={data.history.items} size={size} onChangeCourse={this.props.onChangeCourse} />
              </InfiniteScroll>
            </Panel>
          )
        }}
      </Query>
    )
  }
}

export default HistoryComponent
