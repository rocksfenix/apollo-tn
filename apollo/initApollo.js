import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import resolvers from './resolvers'
import typeDefs from './typeDefs'
// import { removeCookie } from '../lib/redirect'
import Constants from '../config'
import cookie from 'js-cookie'
import '../lib/session'

const { JWT_KEY, JWT_RFS_KEY, JWT_REHYDRATE_KEY } = Constants

let apolloClient = null
let URI = process.env.NODE_ENV === 'production'
  ? 'https://whispering-stream-39142.herokuapp.com/graphql'
  : 'http://192.168.1.96:8080/graphql'

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { getTokens, csrf, Cookie, xoxo }) {
  const cache = new InMemoryCache().restore(initialState || {})

  const httpLink = createHttpLink({
    uri: URI,
    credentials: 'same-origin'
  })

  const authLink = setContext((request, ctx) => {
    let headers = {}
    const { token, refreshToken } = getTokens()

    if (!process.browser) {
      headers['x-xoxo'] = xoxo
    }

    return {
      headers: {
        ...headers,
        [JWT_KEY]: token,
        [JWT_RFS_KEY]: refreshToken,
        'CSRF-Token': csrf,
        Cookie
      }
    }
  })

  const authAfterware = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
      const context = operation.getContext()
      const { response: { headers } } = context
      if (headers) {
        const token = headers.get(JWT_REHYDRATE_KEY)
        // Si la session fu expirada se eliminan el token
        // y se redirecciona para volver a acceder
        const isSessionExpired = headers.get('x-tn-expired-session')
        if (isSessionExpired) {
          cookie.remove(JWT_KEY)
          cookie.remove(JWT_RFS_KEY)
          if (process.browser) {
            window.location = '/?expired=true'
          }
        }

        if (token) {
          console.log(`REHYDRATE TOKEN
          ${token}
          ${cookie.get(JWT_KEY)}
          `)
          cookie.set(JWT_KEY, token)
          // localStorage.setItem('token', token)
        }
      }
      if (response.errors && response.errors.length) {
        if (response.errors[0].message === 'No autenticado') {
          // localStorage.removeItem('token')
          // window.location = '/login'
        }
      };
      return response
    })
  })

  const stateLink = withClientState({
    defaults: {
      visibilityFilter: 'SHOW_ALL',
      config: {
        showLessons: false,
        position: 'left',
        __typename: 'Conf'
      }
    },
    typeDefs,
    cache,
    resolvers
  })

  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authAfterware.concat(stateLink.concat(authLink.concat(httpLink))),
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
