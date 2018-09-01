import React, {Component} from 'react'
import styled from 'styled-components'

const Panel = styled.section`
  width: 100%;
  padding-left: ${p => p.padding};
  transition: padding-left .2s cubic-bezier(1,0,0,1);
`

export default class extends Component {
  render () {
    // Si es mobile el padding es 10
    // a no ser que showMobileNav
    let padding = this.props.device === 'mobile'
      ? this.props.showMobileNav
        ? '60px'
        : '10px'
      : '55px'

    return (
      <Panel padding={padding}>
        <h2>Home {padding}-*---------------{this.props.tab}</h2> 
        <hr />
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit sed unde debitis odit reiciendis amet culpa perspiciatis, cumque possimus tenetur hic quibusdam modi aliquid placeat sunt aut? Accusamus, velit tenetur.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illum repellat cum in, veniam eos. Doloremque distinctio repellat architecto fuga neque dolores laborum officiis nemo ullam illum, veritatis ex illo?</p>

      </Panel>
    )
  }
}
