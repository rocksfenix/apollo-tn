import React, {Component} from 'react'
import styled from 'styled-components'
import { WithContext as ReactTags } from 'react-tag-input'
import LabelField from './LabelField'

const Panel = styled.div`
  width: 100%;
  display: flex;
  padding: .3em 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e9f3f5;
`

export default class extends Component {
  state = {
    show: false,
    tags: []
  }

  componentWillMount () {
    const { tags } = this.props
    if (tags.length) {
      this.setState({ tags: tags.map(t => ({ id: t, text: t })) })
    }
  }

  handleDelete = (i) => {
    const { tags } = this.state
    this.setState({ tags: tags.filter((tag, index) => index !== i) }, () => {
      this.props.onChange(this.props.keyName, this.getTagsMaped(this.state.tags))
    })
  }

  handleAddition = (tag) => {
    this.setState(state => ({ tags: [...state.tags, tag] }), () => {
      this.props.onChange(this.props.keyName, this.getTagsMaped(this.state.tags))
    })
  }

  // Regresa las tags pero solo como un string [ 'fruta' ]
  // En lugar de [ { id: 'text', text: 'El texto' }]
  getTagsMaped = (tags) => tags.map(t => t.text)

  suggestions = [
    { id: 'javascript', text: 'javascript' },
    { id: 'react.js', text: 'react.js' },
    { id: 'ES2015', text: 'ES2015' },
    { id: 'ES6', text: 'ES6' },
    { id: 'CSS', text: 'CSS' },
    { id: 'HTML', text: 'HTML' }
  ]

  render () {
    return (
      <Panel>
        <LabelField>{ this.props.label }</LabelField>
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
