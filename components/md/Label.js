import styled from 'styled-components'
import rem from './util/rem'
import { violetRed } from './util/colors'
import { headerFont } from './util/fonts'

export const LabelGroup = styled.div`
  display: inline-block;
  margin-left: 0.5rem;

  position: relative;
  bottom: ${rem(3)};
`

const Label = styled.small`
  display: inline-block;
  background: ${violetRed};
  color: white;
  font-size: 0.75rem;
  font-family: ${headerFont};
  border-radius: ${rem(3)};
  padding: ${rem(1)} ${rem(5)};
  margin-left: 0.4rem;
`

export default Label
