import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styled from 'styled-components'
import uniqBy from 'lodash/uniqBy'
import ItemHistory from './ItemHistory'
import { Query } from 'react-apollo'
import { HISTORY, LESSON } from '../queries'

const Panel = styled.div`
  width: ${p => p.isMobile ? '100%' : '355px'};
  height: ${p => p.expanded ? '100vh' : '55px'};
  padding-left: 55px;
  display: flex;
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

const HistoryItems = ({ expanded, historyItems, onChangeCourse, color, current }) => {
  let items = historyItems

  // Para evitar que se duplique si el de reproduccion
  // actual es el firmo que el primer elemento de items
  // se elimina el primero
  if (current) {
    if (current.lessonSlug === historyItems[0].lessonSlug) {
      items = items.slice(1)
    }
  }

  // Si esta expandido
  if (expanded) {
    return (
      <React.Fragment>
        {items.map(item => (
          <ItemHistory
            animated
            key={item._id}
            item={item}
            expanded={expanded}
            onChangeCourse={onChangeCourse}
            color={color}
          />
        ))}
      </React.Fragment>
    )
  }

  // En caso de este en tab home
  // Se muestra la ultima vista
  if (items[0] && !current) {
    return <ItemHistory
      animated
      key={items[0]._id}
      item={items[0]}
      expanded={expanded}
      onChangeCourse={onChangeCourse}
      color={color}
    />
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
  position: absolute;
  bottom: 0;
  padding-right: 58px;
`

const Spinner = styled.img`
  width: 120px;
`

class HistoryComponent extends Component {
  // shouldComponentUpdate (nextProps, nextState) {
  //   return nextProps.tab !== this.props.tab
  // }

  render () {
    const { show, tab, course, lessonSlug, showMobileNav, isMobile } = this.props
    // Existen solo 2 tamaños diferentes
    // expanded o no

    const expanded = tab === 'history'
    let _show = show

    // Se oculta si es mobile y esta
    // ocula la barra de navegacion
    if (isMobile && !showMobileNav) _show = false
    if (tab === 'course') _show = false

    return (
      <Query
        query={HISTORY}
        variables={{ limit: 20, offset: 0 }}
      >
        {({ data, error, loading, fetchMore }) => {
          if (!data || loading) return <h1>Loading</h1>
          if (error) return <h1>error {error}</h1>
          if (!data.history.items.length) return null

          return (
            <Panel
              id='scrollableHistory'
              show={_show}
              expanded={expanded}
              isMobile={isMobile}
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
                    <LoadingBox show={data.history.hasMore && expanded}>
                      <Spinner src='/static/ellipsis.svg' />
                    </LoadingBox>
                  )
                }
              >
                {
                  lessonSlug
                    ? (
                      <Query query={LESSON} variables={{ slug: lessonSlug }}>
                        {({ data: { lesson }, loading }) => {
                          if (loading || !lesson) return null
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
                                  expanded={expanded}
                                  isMobile={isMobile}
                                />
                                <HistoryItems
                                  current={current}
                                  historyItems={data.history.items}
                                  expanded={expanded}
                                  onChangeCourse={this.props.onChangeCourse}
                                  color={course.color}
                                />
                              </div>
                            )
                          }
                        }}
                      </Query>
                    )
                    : (
                      <HistoryItems
                        expanded={expanded}
                        historyItems={data.history.items}
                        onChangeCourse={this.props.onChangeCourse}
                      />
                    )
                }
              </InfiniteScroll>
            </Panel>
          )
        }}
      </Query>
    )
  }
}

export default HistoryComponent
