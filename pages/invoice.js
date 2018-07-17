import React from '../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/react'

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
