import React from 'react'
import cookie from 'cookie'
import PropTypes from 'prop-types'
import { getDataFromTree } from 'react-apollo'
import Head from 'next/head'
import initApollo from './initApollo'
import Constants from '../config'

const { JWT_KEY, JWT_RFS_KEY } = Constants

function parseCookies (req, options = {}) {
  return cookie.parse(
    req ? req.headers.cookie || '' : document.cookie,
    options
  )
}

function getTokens (req) {
  return {
    token: parseCookies(req)[JWT_KEY],
    refreshToken: parseCookies(req)[JWT_RFS_KEY]
  }
}

export default App => {
  return class WithData extends React.Component {
    static displayName = `WithData(${App.displayName})`
    static propTypes = {
      apolloState: PropTypes.object.isRequired
    }

    static async getInitialProps (ctx) {
      const { Component, router, ctx: { req, res } } = ctx

      // Estos tokens son almacenados en memoria para
      // posteriores solicitudes del cliente
      let csrf = ''
      let Cookie = ''
      let xoxo = ''

      if (process.env.SAFE_ENV === 'safe') {
        Cookie = req.headers.cookie
        csrf = req.csrfToken()
        xoxo = req.getXoxoToken(req)
      }

      // console.info('MODO ::: ', process.env.SAFE_ENV === 'safe', csrf)

      const apollo = initApollo({}, {
        // Obtenemos el Token JWT
        getTokens: () => getTokens(req),
        // Obtenemos el token de meta _csrf
        csrf,

        // Obtenemos la cookie adicional de csrf (la genera express-csrf)
        Cookie,

        // Generamos para server
        xoxo
      })

      ctx.ctx.apolloClient = apollo

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {}
      }

      // Run all graphql queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloClient={apollo}
          />
        )
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
        console.error('Error while running `getDataFromTree`', error)
      }

      if (!process.browser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract()

      return {
        ...appProps,
        apolloState,
        csrf
      }
    }

    // Siempre que se ejecuta una primer consulta desde el cliente
    // De ejecuta el constructor
    constructor (props) {
      super(props)
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, {
        getTokens: () => getTokens(),
        csrf: props.csrf
      })
    }

    render () {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
