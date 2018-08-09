import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import _Dropzone from 'react-dropzone'
import styled from 'styled-components'

const ImagePreview = styled.img`
  width: 100px;
  margin: 0 auto;
  display: block;
  margin-bottom: 1em;
`

const Dropzone = styled(_Dropzone)`
  position: relative;
  width: 80%;
  min-height: 400px;
  border-width: 1px;
  border-color: #8c8c8c;
  border-style: dashed;
  border-radius: 5px;
  margin: 0 auto;
  transition: all .2s ease-out;
  max-height: 400px;
  overflow: auto;

  :hover {
    border-color: purple;
  }
`

class UploadFile extends Component {
  state = { isFetching: false, hasImage: false, preview: null }
  onDrop = async ([file]) => {
    if (file.type.indexOf('image') !== -1) {
      // Agregar preview de imagen
      this.setState({ isFetching: true, hasImage: true, preview: file.preview })
    } else {
      // Agregar preview de arvhico desconocido
      this.setState({ isFetching: true, hasImage: true, preview: '/static/quotes-warning.svg' })
    }

    const response = await this.props.mutate({
      variables: { file }
    })
    console.log(response)
    this.setState({ isFetching: false, hasImage: false })
  }

  render () {
    return (
      <Dropzone onDrop={this.onDrop}>
        { this.state.isFetching ? <h4>Fetching...</h4> : null }
        { this.state.hasImage
          ? <ImagePreview src={this.state.preview} />
          : null
        }
        { this.props.children }
      </Dropzone>
    )
  }
}

export default graphql(gql`
  mutation($file: Upload!) {
    assetUpload(file: $file)
  }
`)(UploadFile)
