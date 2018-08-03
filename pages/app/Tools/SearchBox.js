import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Search = styled.input`
  padding: 5px 13px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  font-size: 18px;
  border: 1px solid #aaa;
  border-radius: 4px;
  -webkit-appearance: none;
  font-family: Roboto;
  font-weight: 100;
  color: #FFF;
  margin: .5em 13px;
  transition: all .3s ease-out;
  width: 93%;

  &:focus {
    outline: none;
    box-shadow: 0 1px 20px #27dcff;
  }
`

class SearchComponent extends Component {
  textInput = React.createRef()

  componentWillReceiveProps (nextProps) {
    if (nextProps.focus) {
      this.focus()
    } else {
      this.blur()
    }
  }

  componentDidMount () {
    window.setTimeout(() => {
      this.focus()
    }, 200)
  }

  focus = () => {
    ReactDOM.findDOMNode(this.textInput.current).focus()
  }

  blur = () => {
    ReactDOM.findDOMNode(this.textInput.current).blur()
  }

  handleKeyPress = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()

      if (this.props.onArrowDown) {
        this.props.onArrowDown()
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()

      if (this.props.onArrowUp) {
        this.props.onArrowUp()
      }
    }

    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      if (this.props.onEnter) {
        this.props.onEnter(e.target.value)
      }
    }
  }

  render () {
    return (
      <Search
        type='text'
        onKeyUp={this.handleKeyPress}
        ref={this.textInput}
        onKeyPress={this.search}
        className='mousetrap'
      />
    )
  }
}

export default SearchComponent
