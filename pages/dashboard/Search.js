import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'

const Search = styled.input`
  min-width: 400px;
  padding: 11px 20px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  font-size: 18px;
  border: 1px solid #aaa;
  border-radius: 4px;
  -webkit-appearance: none;
  font-family: Roboto;
  font-weight: 100;

  &:focus {
    outline: none;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  }
`

class SearchComponent extends Component {
  search = debounce(300, (e) => {
    if (this.props.onSeach) {
      const value = ReactDOM.findDOMNode(this.refs.input).value
      this.props.onSeach(value)
    }
  })

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      if (this.props.onEnter) {
        this.props.onEnter(e.target.value)
      }
    }
  }

  render () {
    return (
      <Search onKeyUp={this.handleKeyPress} ref='input' onKeyPress={this.search} />
    )
  }
}

export default SearchComponent
