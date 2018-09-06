import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import uniqBy from 'lodash/uniqBy'
import ItemHistory from './ItemHistory'
import { Query } from 'react-apollo'
import { HISTORY, LESSON } from '../queries'

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

const HistoryItems = ({ show, size, historyItems, onChangeCourse, color, current }) => {
  let items = historyItems

  // Para evitar que se duplique si el de repreduccion
  // actual es el firmo que el primer elemento de items
  // se elimina
  if (current.lessonSlug === historyItems[0].lessonSlug) {
    items = items.slice(1)
  }

  if (show) {
    return (
      <React.Fragment>
        {items.map(item => (
          <ItemHistory
            animated
            key={item._id}
            item={item}
            size={size}
            onChangeCourse={onChangeCourse}
            color={color}
          />
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
    const { show, tab, playing, course, lessonSlug, showMobileNav, isMobile } = this.props
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

    return (
      <Query query={HISTORY} variables={{ limit: 20, offset: 0 }}

      >
        {({ data, error, loading, fetchMore, client }) => {
          if (!data || loading) return <h1>Loading</h1>
          if (error) return <h1>error {error}</h1>
          //
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
                dataLength={data.history.items.length + 1}
                next={() => {
                  fetchMore({
                    variables: {
                      offset: data.history.items.length
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev

                      // Filtramos duplicados
                      const items = uniqBy([
                        ...prev.history.items,
                        ...fetchMoreResult.history.items
                      ], (i) => i._id)

                      return {
                        history: {
                          ...prev.history,
                          items,
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
                {/* Obtenemos la leccion activa */}
                <Query query={LESSON} variables={{ slug: lessonSlug }}>
                  {({ data: { lesson }, loading }) => {
                    if (loading) return null
                    if (lesson) {

                      if (lesson) {
                        const current = {
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
                          <div>
                            <ItemHistory
                              current
                              color={course.color}
                              hideSidebar={this.props.hideSidebar}
                              item={current}
                              size={size}
                              isMobile={isMobile}
                            />
                            <HistoryItems
                              show={expanded}
                              current={current}
                              historyItems={data.history.items}
                              size={size}
                              onChangeCourse={this.props.onChangeCourse}
                              color={course.color}
                            />
                          </div>
                        )
                      }

                      return (
                        <HistoryItems
                          show={expanded}
                          historyItems={data.history.items}
                          size={size}
                          onChangeCourse={this.props.onChangeCourse}
                          color={course.color}
                        />
                      )
                    }
                  }}
                </Query>
              </InfiniteScroll>
            </Panel>
          )
        }}
      </Query>
    )
  }
}

export default HistoryComponent
