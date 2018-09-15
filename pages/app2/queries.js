import gql from 'graphql-tag'

export const SNIPPETS = gql`
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

export const LESSON = gql`
  query lesson ($slug: String!) {
    lesson(slug: $slug) {
      _id
      slug
      title
      role
      tech
      transcription
      videoSource
      techVersion
      isTranscriptionPublic
      isPublished
      duration
      createdAt
      screenshot {
        s100
      }
    }
  }
`

export const HISTORY = gql`
  query history($limit: Int, $offset: Int) {
    history(limit: $limit, offset: $offset) @connection(key: "history") {
      hasMore
      items {
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
  }
`

export const COURSE = gql`
  query search($slug: String!) {
    course(slug: $slug) {
      title
      slug
      _id
      cover {
        s100
      }
      color
      description
      tech
      lessons {
        isWatched
        title
        tech
        techVersion
        transcription
        synopsis
        slug
        _id
      }
    }
  }
`

export const ME = gql`{
  userSelf {
    _id
    fullname
    email
    role
    avatar {
      s100
    }
    acceptTermsAndPrivacy
  }
}
`

export const ONLINE = gql`
  mutation {
    online
  }
`
