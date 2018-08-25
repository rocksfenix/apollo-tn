import React, {Component} from 'react'
import styled from 'styled-components'
import Panel from '../Panel'

class Tickets extends Component {
  render () {
    return (
      <Panel show={this.props.show} >
        Tickets
      </Panel>
    )
  }
}

export default Tickets
