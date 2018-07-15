import React from 'react'

export default class extends React.Component {
  static async getInitialProps ({ req, apolloClient }) {
    return {
      id: req.params.id || '',
      slug: req.params.slug || ''
    }
  }
  render () {
    return (
      <div>
        <h1>INVOICE {this.props.id}</h1>
        <h1>SLUG {this.props.slug}</h1>

      </div>
    )
  }
}
