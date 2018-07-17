import styled from 'styled-components'

export default styled.button`
  display: block;
  margin: 15px 0;
  width: 100%;
  background-color: ${props => props.active ? 'green' : '#555B62'};
  cursor: ${props => props.active ? 'pointer' : 'not-allowed;'};
  font-size: 20px;
  font-family: Roboto;
  font-weight: 300;
  border: 0;
  line-height: 2.2;
  color: #FFF;
  border-radius: 20px;
  transition: all .2s ease-out;
  outline: none;
  box-sizing: border-box;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`
