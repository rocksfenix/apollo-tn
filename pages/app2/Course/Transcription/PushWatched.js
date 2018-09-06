import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { COURSE, HISTORY } from '../../queries'
import uniqBy from 'lodash/uniqBy'

const WATCHED = gql`
  mutation watchedCreate ($input: WatchedCreate) {
    watchedCreate(input: $input) {
      _id
      author
      lesson
      course
      watchedAt
      tech
      lessonTitle
      courseTitle
      courseSlug
      lessonSlug
    }
  }
`

export default ({ course, lesson, force }) => (
  <Mutation
    mutation={WATCHED}
    update={(cache, { data }) => {
      // Actualizamos el cache de lecciones vistas
      const c = cache.readQuery({ query: COURSE, variables: { slug: course.slug } })
      const lessons = c.course.lessons.map(l => {
        if (l._id === data.watchedCreate.lesson) {
          l.isWatched = true
        }
        return l
      })
      cache.writeQuery({
        query: COURSE,
        variables: { slug: course.slug },
        data: {
          course: {
            ...c.course,
            lessons
          }
        }
      })

      const { history } = cache.readQuery({ query: HISTORY })

      // Filtramos por unicos, porque puede pasar
      // que en el mismo history ya se haya visto la leccion
      const items = uniqBy([ data.watchedCreate, ...history.items ], (e) => e._id)

      cache.writeQuery({
        query: HISTORY,
        data: {
          history: {
            ...history,
            items,
            hasMore: history.hasMore
          }
        }
      })
    }}

  >
    {(watchedCreate, { data, error, loading }) => {
      if (loading) return <h1>Loading</h1>
      if (error) return <h1>error {error}</h1>

      return (
        <button
          onClick={() => {
            watchedCreate({ variables: {
              input: {
                lesson: lesson._id,
                course: course._id,
                tech: lesson.tech,
                lessonTitle: lesson.title,
                courseTitle: course.title,
                courseSlug: course.slug,
                lessonSlug: lesson.slug
              }
            }})
          }}>
          PUSH WATCHED
        </button>
      )
    }}
  </Mutation>
)
