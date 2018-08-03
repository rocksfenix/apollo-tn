import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_USER_PROFILE = gql`{
  userSelf {
    _id
    fullname
    email
    role
    avatar {
      small
    }
    acceptTermsAndPrivacy
  }
}
`

export default (Comp) => class extends React.Component {
  static async getInitialProps ({ req }) {
    let query = {}
    let params = {}
    try {
      query = req.query
      params = req.params
    } catch (error) {}
    return {
      query,
      params
    }
  }

  render () {
    return (
      <Query query={GET_USER_PROFILE}>
        {({ loading, error, data = {}, client, refetch, networkStatus }) => {
          let user = {}
          if (data.userSelf) user = data.userSelf
          return <Comp {...this.props} user={user} />
        }}
      </Query>
    )
  }
}
