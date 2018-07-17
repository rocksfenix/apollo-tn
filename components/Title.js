import React from 'react'
import styled from 'styled-components'

const H1 = styled.h1`
  width: 100%;
  font-size: ${props => props.size || '40px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform || ''};

  @media (max-width: 900px) {
    text-align: center;
  }
`

const H2 = styled.h2`
  width: 100%;
  font-size: ${props => props.size || '36px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform || ''};

  @media (max-width: 900px) {
    text-align: center;
  }
`

const H3 = styled.h3`
  width: 100%;
  font-size: ${props => props.size || '30px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform || ''};

  @media (max-width: 900px) {
    text-align: center;
  }
`

const H4 = styled.h4`
  width: 100%;
  font-size: ${props => props.size || '28px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform};

  @media (max-width: 900px) {
    text-align: center;
  }
`

const H5 = styled.h5`
  width: 100%;
  font-size: ${props => props.size || '24px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform || ''};

  @media (max-width: 900px) {
    text-align: center;
  }
`

const H6 = styled.h6`
  width: 100%;
  font-size: ${props => props.size || '22px'};
  color: #27244b;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.3em;
  text-align: ${props => props.textAlign};
  text-transform: ${props => props.textTransform || ''};

  @media (max-width: 900px) {
    text-align: center;
  }
`

export default (props) => {
  switch (props.as) {
    case 'h1':
      return <H1 {...props}>{ props.children }</H1>

    case 'h2':
      return <H2 {...props}>{ props.children }</H2>

    case 'h3':
      return <H3 {...props}>{ props.children }</H3>

    case 'h4':
      return <H4 {...props}>{ props.children }</H4>

    case 'h5':
      return <H5 {...props}>{ props.children }</H5>

    case 'h6':
      return <H6 {...props}>{ props.children }</H6>

    default:
      return <H1 {...props}>{ props.children }</H1>
  }
}
