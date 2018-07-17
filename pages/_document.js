import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
// TODO Crear logo responsive
export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          {this.props.styleTags}
          <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=yes' />
          <link rel='stylesheet' type='text/css' href='/static/global.css' />
          <link rel='stylesheet' type='text/css' href='/static/icons/style.css' />
          <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,700,900' rel='stylesheet' />
          <script src='https://www.google.com/recaptcha/api.js' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
