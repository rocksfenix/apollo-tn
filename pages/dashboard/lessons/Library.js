import React, {Component} from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import copy from 'copy-to-clipboard'
import Dropzone from './Dropzone'
import Search from '../SearchBox'

const ASSETS = gql`
  query assets($text: String) {
    assets(text: $text) {
      assets {
        _id,
        # author: User
        type
        filename
        mimetype
        location
        ext
        size
        thumbnail {
          s30
          s50
          s100
        }
      }
      total
    }
  }
`

const Panel = styled.div`
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #FFF;
  margin: 0 auto;
`

const SearchBox = styled.div`
  width: 100%;
  height: 50px;
  background-color: #1d1d28;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Files = styled.div`
  width: 100%;
  padding: 0;
  margin-top: 2em;
  padding: 0 1em;
`

const File = styled.li`
  list-style: none;
  font-size: 14px;
  padding: .3em 1em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #efefef;
  border-radius: 3px;
  margin-bottom: 1em;

  :hover {
    background-color: #00b6ff;
    color: #FFF;
  }
`

const FileSize = styled.div`
  font-size: 11px;
  opacity: .5;
`

const Image = styled.img`
  height: 50px;
`

class LibraryComponent extends Component {
  state = {
    total: 0,
    assets: []
  }

  search = async (text) => {
    const response = await this.props.client.query({
      query: ASSETS,
      variables: { text }
    })

    this.setState({
      assets: response.data.assets.assets,
      total: response.data.assets.total
    })
  }

  onCopy = (file) => {
    if (file.type === 'image') {
      copy(`![](${file.location})`)
    } else {
      copy(file.location)
    }
  }

  render () {
    if (!this.props.show) return null
    return (
      <Panel>
        <SearchBox>
          <Search
            onSeach={this.search}
            style={{
              'background-color': '#FFF',
              'height': '34px',
              'width': '50%'
            }}
          />
        </SearchBox>

        <Dropzone>
          <Files onClick={e => e.stopPropagation()}>
            {this.state.assets.map(asset => (
              <File key={asset._id} onClick={() => this.onCopy(asset)}>
                <Image
                  src={
                    asset.type === 'image'
                      ? asset.thumbnail.s50
                      : '/static/unknow-file.svg'
                  }
                />

                { asset.filename }
                <FileSize>{ asset.size } Bytes</FileSize>
              </File>
            ))}
          </Files>
        </Dropzone>
      </Panel>
    )
  }
}

export default withApollo(LibraryComponent)
