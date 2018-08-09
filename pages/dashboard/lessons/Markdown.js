
import React from 'react'
import styled from 'styled-components'
import Markdown from '../../../components/md/Markdown'

const BoxMarkdown = styled.div`
  width: 100%;
  height: 90vh;
  margin: 0 auto;
  overflow: auto;
  background-color: #FFF;
  padding: 0 1em 0 1em;
  position: relative;
`

export default (props) => {
  if (!props.show) return null
  return (
    <BoxMarkdown>
      <Markdown markdown={props.markdown} />
    </BoxMarkdown>
  )
}
