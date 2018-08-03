import styled from 'styled-components'
import { monospace } from './util/fonts'

const Code = styled.span`
  display: inline-block;
  font-family: ${monospace};
  font-size: 90%;
  font-weight: 300;
  padding: 0 0.05em 0.1em;
  vertical-align: baseline;
  line-height: 1.4;
`

export default Code
