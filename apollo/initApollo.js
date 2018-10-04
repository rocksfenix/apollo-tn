import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'
// import ws from 'ws'
// import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
// import 'subscriptions-transport-ws'

import { withClientState } from 'apollo-link-state'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import introspectionQueryResultData from './fragmentTypes.js'
import Constants from '../config'
import '../lib/session'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const { JWT_KEY, JWT_RFS_KEY, JWT_REHYDRATE_KEY } = Constants

let apolloClient = null
let URI = process.env.NODE_ENV === 'production'
  ? 'https://whispering-stream-39142.herokuapp.com/graphql'
  : 'http://192.168.1.131:3000/graphql'

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { getTokens, csrf, Cookie, xoxo }) {

  // Cambiamos por upload
  const httpLink = createUploadLink({
    uri: URI,
    credentials: 'same-origin'
  })

  let wsLink = null

  if (process.browser) {
    // Create a WebSocket link:
    const { token, refreshToken } = getTokens()

    wsLink = new WebSocketLink({
      uri: `ws://192.168.1.131:3000/subscriptions`,
      options: {
        reconnect: true,
        connectionParams: {
          token: token,
          refreshToken: refreshToken
        }
      }
    })
  }

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
          // console.log(`REHYDRATE TOKEN
          //   ${token}
          //   ${cookie.get(JWT_KEY)}
          // `)
          cookie.set(JWT_KEY, token, { expires: 30 })
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

  const cache = new InMemoryCache({
    fragmentMatcher
    // dataIdFromObject: object => object._id
  }).restore(initialState || {})

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

  // Existen 2 Links finales
  // El httpLinkWithAuth
  // El wsLink
  const httpLinkWithAuth = authAfterware.concat(
    stateLink.concat(authLink.concat(httpLink))
  )

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = !process.browser ? httpLinkWithAuth : split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkWithAuth
  )

  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link,
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
