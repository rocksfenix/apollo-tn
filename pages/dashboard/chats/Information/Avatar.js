import styled from 'styled-components'

const Avatar = styled.div`
  width: ${props => props.size || '22px'};
  height: ${props => props.size || '22px'};
  border-radius: 50%;
  background: url(${props => props.src});
  background-size: cover;
`

export default Avatar
