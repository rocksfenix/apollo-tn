import React, {Component} from 'react'
import MenuBar from './MenuBar'
import styled from 'styled-components'

const SnippetDetailsBox = styled.div`
  width: 60%;
  height: 100%;
  overflow: hidden;
  background-color: #232323;

  @media (max-width: 900px) {
    width: 100%;
  }
`

const SnippedDetailsCode = styled.div`
  font-size: 14px;
  overflow: auto;
  width: 100%;
  height: 100%;
`

let AceEditor = null

if (process.browser) {
  require('brace')
  require('brace/mode/javascript')
  require('brace/theme/ambiance')
  AceEditor = require('react-ace').default
}

// Render editor
export default class extends Component {
  state = { code: '' }

  componentDidUpdate (prevProps) {
    if (this.props.snippet._id !== prevProps.snippet._id) {
      this.push()
    }
  }

  push = () => {
    this.setState({ code: this.props.snippet.code })
  }

  onChange = (code) => this.setState({ code })

  render () {
    if (process.browser) {
      const width = window.innerWidth > 900 ? '100%' : '100%'
      return (
        <SnippetDetailsBox>
          <MenuBar
            snippet={this.props.snippet}
            code={this.state.code}
            {...this.props}
          />
          <SnippedDetailsCode>
            <AceEditor
              mode='javascript'
              theme='ambiance'
              onChange={this.onChange}
              name='UNIQUE_ID_OF_DIV'
              fontSize={14}
              width={width}
              height='100%'
              editorProps={{$blockScrolling: true}}
              value={this.state.code}
            />
          </SnippedDetailsCode>
        </SnippetDetailsBox>
      )
    }
    return <div />
  }
}
