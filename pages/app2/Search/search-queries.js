import gql from 'graphql-tag'

export const SEARCH = gql`
  query search($text: String!) {
    search(text: $text) {
      ... on Course {
        courseTitle: title
        slug
        _id
        color
        tech
        cover {
          s100
        }
      }
      
      ... on Lesson {
        lessonTitle: title
        courseSlug
        _id
        slug
        tech
      }
    }
  }
`

export const COURSE_DETAILS = gql`
  query search($slug: String!) {
    course(slug: $slug) {
      title
      slug
      tech
      _id
      duration
      cover {
        s100
      }
      lessons {
        tech
        title
        duration
        synopsis
        slug
        _id
      }
    }
  }
`
