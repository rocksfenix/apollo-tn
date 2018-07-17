import React, {Component} from 'react'
import styled from 'styled-components'
import Public from './Public'
import Navegation from '../../components/Navegation'
import SeoHead from '../../components/SeoHead'
import { redirect } from '../../lib/redirect'
import WithUser from '../../components/WithUser'
import Expired from '../../components/Expired'

// import { Query } from 'react-apollo'

const View = styled.div`
  overflow-x: hidden;
  position: relative;
`

class Home extends Component {
  // static getInitialProps (ctx) {
  //   return {}
  // }
  static async getInitialProps ({ req }) {
    console.log('PARAM-S', req.query)
    return {
      query: req.query
    }
  }

  static defaultProps = {
    user: {}
  }

  componentDidMount () {
    if (this.props.user._id) {
      if (!this.props.user.acceptTermsAndPrivacy) {
        redirect('/accept-terms')
      }
    }
  }

  getPageDash = () => {
    // Public
    if (!this.props.user.role) {
      return <Public />
    }

    return <Public />

    // if (user.role === 'ninja admin') {
    //   return <AdminPage {...this.props} />
    // }

    // if (user.role === 'ninja pro') {
    //   return <ProPage {...this.props} />
    // }

    // if (user.role === 'ninja free') {
    //   return <FreePage {...this.props} />
    // }
  }

  render () {
    const { query } = this.props
    // const { user } = this.props

    // console.log(user)
    return (
      <View>
        <SeoHead title='Cursos de desarrollo Web Fullstack' />
        { query['rejected-policy'] ? <Expired /> : null }
        <Navegation />
        { this.getPageDash() }
      </View>
    )
  }
}

export default WithUser(Home)
