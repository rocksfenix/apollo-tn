import NextHead from 'next/head'
import React, { Component } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = (url) => {
  // console.log(`Loading: ${url}`)
  NProgress.start()
}

Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default class SeoHead extends Component {
  render () {
    const title = this.props.title || 'tecninja.io'
    const {
      description = this.props.description || 'Cursos y lecciones de alta calidad de las ultimas herramientas del desarrollo web Fullstack',
      children,
      canonical,
      url = ''
    } = this.props
    const properCanonical = canonical || url
    return (
      <NextHead>
        <title>
          {title}
        </title>
        <meta name='description' content={description} />
        {children}
        <link
          rel='canonical'
          href={`https://tecninja.io${properCanonical}`}
        />
      </NextHead>
    )
  }
}
