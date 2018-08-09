import React, {Component} from 'react'
import styled from 'styled-components'
import reactDOM from 'react-dom'
import Markdown from '../../../components/md/Markdown'

const Panel = styled.div`
  width: 100%;
  display: ${p => p.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-around;
`

const BoxMarkdown = styled.div`
  width: 50%;
  height: 90vh;
  float: left;
  overflow-y: hidden;
  overflow-x: hidden;
  transition: all .3s ease-out;
  background-color: #FFF;
  padding: 0 1em 0 1em;
`

const Textarea1 = styled.textarea`
  float: left;
  width: 50%;
  height: 90vh;
  padding: 1.5em;
  background: #21252b;
  color: #666;
  font-size: 14px;
  outline: none;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
  background: #ddd;
  }

  &::-webkit-scrollbar-thumb {
    background: #666; 
  }
`

export default class extends Component {
  //
  onChange = (e) => {
    const value = e.target.value

    if (this.props.onChange) {
      this.props.onChange('transcription', value)
    }
  }

  onScroll = (e) => {
    // Emisor
    const total = e.target.scrollHeight - e.target.clientHeight
    const percent = Math.round((e.target.scrollTop * 100) / total)

    // Receptor
    const totalRec = this.markup.scrollHeight - this.markup.clientHeight
    const percentRec = Math.round(percent * totalRec / 100)

    this.markup.scrollTop = percentRec
  }

  render () {
    const { label, transcription } = this.props
    return (
      <Panel show={this.props.show}>
        <Textarea1
          onScroll={this.onScroll}
          onChange={this.onChange}
          data-value={label}
          value={transcription}
          spellCheck='false'
        />
        <BoxMarkdown ref={ref => { this.markup = reactDOM.findDOMNode(ref) }}>
          <Markdown markdown={transcription} />
        </BoxMarkdown>
      </Panel>
    )
  }
}
