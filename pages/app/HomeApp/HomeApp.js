import React, {Component} from 'react'
import styled from 'styled-components'

const Panel = styled.section`
  width: 100%;
  padding-left: 55px;
`

export default class extends Component {
  render () {
    return (
      <Panel>
        <h2>Home</h2>
        <hr />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit sed unde debitis odit reiciendis amet culpa perspiciatis, cumque possimus tenetur hic quibusdam modi aliquid placeat sunt aut? Accusamus, velit tenetur.</p>
      </Panel>
    )
  }
}
