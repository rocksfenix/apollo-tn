import React from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { COURSE, HISTORY } from '../../queries'

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
    }
  }
`

export default ({ course, lesson, force }) => (
  <Mutation
    mutation={WATCHED}
    update={(cache, { data }) => {
      console.log(course.slug)

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

      // Actualizamos el chache de history
      const { history } = cache.readQuery({ query: HISTORY, variables: { limit: 20, offset: 0 } })
      console.log(history)
      cache.writeQuery({
        query: HISTORY,
        data: {
          history: {
            items: [
              data.watchedCreate,
              ...history.items
            ],
            ...history
          }
        }
      })
      // Forzamos renderizado
      force()
    }}

  >
    {(watchedCreate, { data, error, loading }) => {
      if (loading) return <h1>Loading</h1>
      if (error) return <h1>error {error}</h1>

      if (data) console.log(data)

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
