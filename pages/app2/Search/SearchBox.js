import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import PropTypes from 'prop-types'

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
  transition: all .2s ease-out;
  width: 93%;

  &:focus {
    outline: none;
    box-shadow: 0 1px 20px #FFF;
  }
`

class SearchComponent extends Component {
  static propTypes = {
    onEnter: PropTypes.func,
    onArrowDown: PropTypes.func,
    onArrowUp: PropTypes.func,
    focus: PropTypes.bool
  }

  textInput = React.createRef()

  componentDidMount () {
    this.input = ReactDOM.findDOMNode(this.textInput.current)
  }

  componentDidUpdate () {
    if (this.props.focus) {
      this.focus()
    } else {
      this.blur()
    }
  }

  focus = () => {
    window.setTimeout(() => {
      this.input.focus()
    }, 200)
  }

  blur = () => {
    window.setTimeout(() => {
      this.input.blur()
    }, 200)
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
