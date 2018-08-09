import React, {Component} from 'react'
import styled from 'styled-components'

const Panel = styled.div`
  width: 700px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #FFF;
  margin: 0 auto;
`

export default class extends Component {
  render () {
    if (!this.props.show) return null
    return (
      <Panel>
        Library coming soon!
      </Panel>
    )
  }
}
