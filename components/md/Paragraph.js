import React, { Component } from 'react'
import styled from 'styled-components'
import Highlightable from 'highlightable'

const P = styled.p`
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  font-size: 16px;
    line-height: 24px;
    margin: 24px 0;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-style: normal;
    color: rgba(0,0,0,0.87);
`

function uid (len) {
  len = len || 7
  return Math.random().toString(35).substr(2, len)
}

export default class extends Component {
  state = { ranges: [] }

  onSelect = (range) => {
    console.log(range)
    // this.setState(state => ({
    //   ...state,
    //   ranges: [
    //     ...state.ranges,
    //     range
    //   ]
    // }))
  }

  onMouseOver = (e) => {
    console.log('HOVER', e)
  }

  render () {
    return (
      <P>
        <Highlightable
          ranges={this.state.ranges}
          enabled
          onTextHighlighted={this.onSelect}
          id={'uniq' + uid()}
          onMouseOverHighlightedWord={this.onMouseOver}
          highlightStyle={{
            backgroundColor: 'tomato',
            color: '#FFF'
          }}
          text={this.props.children}
        />
      </P>
    )
  }
}
