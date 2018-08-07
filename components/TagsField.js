import React, {Component} from 'react'
import styled from 'styled-components'
import { WithContext as ReactTags } from 'react-tag-input'
import Toggle from './Toggle'

const Panel = styled.div`
  width: 100%;
  display: flex;
  padding: .3em 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
`

const Label = styled.div`
  width: 30%;
  color: #151517;
  font-size: 13px;
  margin-bottom: 4px;
  margin-top: 1em;
  font-family: Roboto;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: left;
`

export default class extends Component {
  state = {
    show: false,
    tags: []
  }

  handleDelete = (i) => {
    const { tags } = this.state
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    })
  }

  handleAddition = (tag) => {
    console.log(tag);
    
    this.setState(state => ({ tags: [...state.tags, tag] }))
    // this.props.onChange(tag)
  }

  suggestions = [
    { id: 'javascript', text: 'javascript' },
    { id: 'react.js', text: 'react.js' },
    { id: 'ES2015', text: 'ES2015' },
    { id: 'ES6', text: 'ES6' },
    { id: 'CSS', text: 'CSS' },
    { id: 'HTML', text: 'HTML' }
  ]

  render () {
    console.log(this.props)
    return (
      <Panel>
        <Label>{ this.props.label }</Label>
        <ReactTags
          tags={this.state.tags}
          placeholder='Ninja Tech'
          suggestions={this.suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
        />
      </Panel>
    )
  }
}
