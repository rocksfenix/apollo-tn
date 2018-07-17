import React from 'react'
import styled from 'styled-components'

const Title = styled.h1`
  background: orangered;
  color: #FFF;
`
class PageIndex extends React.Component {
  componentDidMount = () => {
    // alert(process.env.BLOGGER_URL)
    console.log(process.env.BLOGGER_URL)
  }

  render () {
    return (
      <div>
        <Title>Hello789 as</Title>
        <h2>asfds</h2>
      </div>
    )
  }
}

export default PageIndex
