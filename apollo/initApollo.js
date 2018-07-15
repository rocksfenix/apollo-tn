// import { ApolloClient, InMemoryCache } from 'apollo-boost'
// import { InMemoryCache } from 'apollo-boost'
// import ApolloClient from 'apollo-boost'
import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import resolvers from './resolvers'
import typeDefs from './typeDefs'


let apolloClient = null
let URI = process.env.NODE_ENV === 'production'
  ? 'https://cryptic-temple-30957.herokuapp.com/graphql'
  : 'http://localhost:3000/graphql'

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { getToken, csrf, Cookie, xoxo }) {

  const cache = new InMemoryCache().restore(initialState || {})

  const httpLink = createHttpLink({
    uri: URI,
    credentials: 'same-origin'
  })

  const authLink = setContext((request, ctx) => {
    let headers = {}

    if (!process.browser) {
      headers['x-xoxo'] = xoxo
    }

    return {
      headers: {
        'x-token': 'Serviseishon asi bien chideishon',
        'CSRF-Token': csrf,
        Cookie,
        ...headers
      }
    }
  })

  const stateLink = withClientState({
    defaults: {
      visibilityFilter: 'SHOW_ALL',
      config: {
        showLessons: false,
        position: 'left',
        __typename: 'Conf'
      },
      // users: []
    },
    typeDefs,
    cache,
    resolvers
  });

  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: stateLink.concat(authLink.concat(httpLink)),
    cache,
    credentials: 'same-origin'
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
