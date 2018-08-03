import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import withApollo from '../apollo/widthApollo'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return <Container>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} client={apolloClient} />
      </ApolloProvider>
    </Container>
  }
}

export default withApollo(MyApp)
