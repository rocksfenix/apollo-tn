import React, {Component} from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { saveAs } from 'file-saver/FileSaver'
import MenuMobile from './MenuMobile'
import { SNIPPETS } from '../queries'

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
  position: relative;
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

const Delete = ({ snippet, hideEditor }) => (
  <Mutation
    mutation={DELETE_SNIPPET}
    variables={{ _id: snippet._id }}
    update={(cache, { data }) => {
      // Actualizamos el cache de lecciones vistas
      const { snippets } = cache.readQuery({ query: SNIPPETS })

      // debugger

      cache.writeQuery({
        query: SNIPPETS,
        data: {
          snippets: {
            ...snippets,
            items: snippets.items.filter(s => s._id !== snippet._id)
          }
        }
      })

      // Cerramos el editor
      hideEditor()
    }}
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

const CloseMobile = styled.button`
  border: 0;
  background: transparent;
  color: #FFF;
`

const CloseEditorMobile = ({ hideEditor }) => {
  return <CloseMobile onClick={hideEditor}><i className='icon-cross' /></CloseMobile>
}

const Cover = styled.img`
  width: 30px;
`

const Desktop = styled.div`
  display: none;
  @media (min-width: 900px) {
    display: block;
  }
`

const Mobile = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  height: 100%;

  @media (max-width: 900px) {
    display: flex;
  }
`

export default class extends Component {
  render () {
    return (
      <MenuBar>
        <Desktop>
          <Button>
            <Cover src={`https://dxpdcvj89hnue.cloudfront.net/cover/${this.props.snippet.courseSlug}-s50`} />
            {this.props.snippet.courseTitle} >
            {this.props.snippet.lessonTitle}
          </Button>
          <Update {...this.props} />
          <Download {...this.props} />
          <Delete {...this.props} />
          <CloseEditor {...this.props} />
        </Desktop>
        <Mobile>
          <MenuMobile />
          <CloseEditorMobile {...this.props} />
        </Mobile>

      </MenuBar>
    )
  }
}
