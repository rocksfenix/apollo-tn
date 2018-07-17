import React, {Component} from 'react'
import { graphql, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'

const query = gql`{
  courses {
    _id
    title
    slug
    description
    author {
      fullname
      username
    }
  }
}
`

export default () => (
  <Query query={query}>
    {({ loading, error, data, client, refetch, networkStatus }) => {
      console.log(loading)
      return (
        <div>
          <h1>Cursos</h1>
          <ul>
            {data.courses.map(c => (
              <li key={c._id}>{c.title}</li>
            ))}
          </ul>
        </div>
      )
    }}
  </Query>
)
