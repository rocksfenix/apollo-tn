import React from 'react'
import styled from 'styled-components'
import './util/prismTemplateString'
import { Editor } from 'react-live'
import { darkGrey } from './util/colors'
import { monospace } from './util/fonts'
import Bar from './Bar'

const CodeBlock = styled((props) => {
  const language = (props.language || 'clike').toLowerCase().trim()
  return (
    <div>
      <Bar
        icon
        colors={[ ]}
        title={props.filename}
        {...props} />
      <Editor {...props} language={language} onChange={props.onChange} />
    </div>
  )
}).attrs({
  contentEditable: true
})`
  background: ${darkGrey};
  font-size: 0.8rem;
  font-family: ${monospace};
  font-weight: 300;
  white-space: pre-wrap;

  border-radius: 0;
  box-shadow: 1px 1px 20px rgba(20, 20, 20, 0.27);
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: hidden;
`
export default CodeBlock
