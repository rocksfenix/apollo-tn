import React from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { saveAs } from 'file-saver/FileSaver'

const UPDATE_SNIPPET = gql`
  mutation snippetUpdate ($_id: ID!, $code: String!) {
    snippetUpdate (_id: $_id, code: $code) {
      _id
      lang
      filename
      code
      author
      lessonTitle
      courseTitle
      lessonSlug
      courseSlug
    }
  }
`

const DELETE_SNIPPET = gql`
  mutation snippetDelete ($_id: ID!) {
    snippetDelete (_id: $_id) {
      _id
      lang
      filename
      code
      author
      lessonTitle
      courseTitle
      lessonSlug
      courseSlug
    }
  }
`

const MenuBar = styled.div`
  width: 100%;
  height: 50px;
  background: #383838;
`

const Button = styled.button`
  background-color: gray;
  border-radius: 2px;
`

const Update = ({ snippet, code }) => (
  <Mutation
    mutation={UPDATE_SNIPPET}
    variables={{ _id: snippet._id, code }}
  >
    {(snippetUpdate, { data, loading, error }) => {
      if (loading) return <div>Loading</div>
      if (error) return <div>Error: {error}</div>

      return <Button onClick={snippetUpdate}>Guardar Cambios</Button>
    }}
  </Mutation>
)

const Delete = ({ snippet }) => (
  <Mutation
    mutation={DELETE_SNIPPET}
    variables={{ _id: snippet._id }}
  >
    {(snippetDelete, { data, loading, error }) => {
      if (loading) return <div>Loading</div>
      if (error) return <div>Error: {error}</div>

      return <Button onClick={snippetDelete}>Eliminar</Button>
    }}
  </Mutation>
)

const Download = ({ snippet, code }) => {
  const Down = () => {
    var blob = new window.Blob([code], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, snippet.filename)
  }
  return <Button onClick={Down}>Download</Button>
}

const CloseEditor = ({ hideEditor }) => {
  return <Button onClick={hideEditor}>close</Button>
}

const Cover = styled.img`
  width: 30px;
`

export default (props) => (
  <MenuBar>
    <Button>
      <Cover src={`https://dxpdcvj89hnue.cloudfront.net/cover/${props.snippet.courseSlug}-s50`} />
      {props.snippet.courseTitle} >
      {props.snippet.lessonTitle}
    </Button>
    <Update {...props} />
    <Download {...props} />
    <Delete {...props} />
    <CloseEditor {...props} />
  </MenuBar>
)
