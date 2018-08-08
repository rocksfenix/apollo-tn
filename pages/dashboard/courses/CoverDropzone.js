import React, {Component} from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import _Dropzone from 'react-dropzone'
import styled from 'styled-components'

const CoverImage = styled.img`
  width: 100px;
  margin: 0 auto;
  display: block;
  margin-bottom: 1em;
`

const Dropzone = styled(_Dropzone)`
  position: relative;
  width: 200px;
  border-width: 2px;
  border-color: transparent;
  border-style: dashed;
  border-radius: 5px;
  margin: 0 auto;
  transition: all .2s ease-out;

  :hover {
    border-color: rgb(171, 170, 204);
  }
`

class UploadFile extends Component {
  state = { isFetching: false, hasImage: false, preview: null }
  onDrop = async ([file]) => {
    this.setState({ isFetching: true, hasImage: true, preview: file.preview })
    const response = await this.props.mutate({
      variables: { file, courseSlug: this.props.courseSlug }
    })
    console.log(response)
    this.setState({ isFetching: false })
  }

  render () {
    return (
      <Dropzone onDrop={this.onDrop}>
        { this.state.isFetching ? <h4>Fetching...</h4> : null }
        <CoverImage src={
          this.state.hasImage
            ? this.state.preview
            : this.props.src
        } />
      </Dropzone>
    )
  }
}

export default graphql(gql`
  mutation($file: Upload! $courseSlug: String!) {
    uploadCover(file: $file, courseSlug: $courseSlug)
  }
`)(UploadFile)
