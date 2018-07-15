import React from 'react'

const Index = ({data}) => (
  <div>
    <h1>Hello TN-GO {data}</h1>
  </div>
)

Index.getInitialProps = async () => {
  // console.log(process.env.BLOGGER_URL)
  return {
    data: process.env.BLOGGER_URL
  }
}

export default Index
