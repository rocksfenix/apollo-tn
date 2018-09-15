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
          <link rel='stylesheet' href='/_next/static/style.css' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no' />
          {/* PWA */}
          <meta name='theme-color' content='#25fff8' />
          <link rel='apple-touch-icon' href='/static/icon.png' />
          <meta name='apple-mobile-web-app-title' content='Hacker News' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='mobile-web-app-capable' content='yes' />
          {/* PWA */}
          <link rel='stylesheet' type='text/css' href='/static/global.css' />
          <link rel='stylesheet' type='text/css' href='/static/icons/style.css' />
          <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,700,900' rel='stylesheet' />
          <script src='https://www.google.com/recaptcha/api.js' />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id='modal-root' className='tn-modal-root' />
        </body>
      </html>
    )
  }
}
