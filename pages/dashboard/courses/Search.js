import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Panel = styled.div`
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Button = styled.button`
  border: 2px solid transparent;
  background-color: #0099d6;
  color: #FFF;
  width: 100px;
  height: 100%;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  outline: none;
  transition: background .3s ease-out;

  :hover {
    background: #00d6a2;
  }
`

const Search = styled.input`
  padding: 10px 20px;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
  font-size: 22px;
  height: 100%;
  border: 1px solid #aaa;
  border-radius: 10px 0 0 10px;
  -webkit-appearance: none;
  font-family: Roboto;
  font-weight: 100;
  width: 50%;
    color: #0093ff;

  &:focus {
    outline: none;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
  }
`

class SearchComponent extends Component {
  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      if (this.props.onSearch) {
        this.props.onSearch(e.target.value)
      }
    }
  }

  onCreate = () => {
    this.props.onCreate(ReactDOM.findDOMNode(this.refs.input).value)
  }

  render () {
    return (
      <Panel>
        <Search
          style={this.props.style}
          onKeyUp={this.handleKeyPress}
          ref='input'
          onKeyPress={this.search}
        />
        <Button onClick={this.onCreate}>
          NEW <i className='thunder-4' />
        </Button>
      </Panel>
    )
  }
}

export default SearchComponent
