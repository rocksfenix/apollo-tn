import gql from 'graphql-tag'

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
