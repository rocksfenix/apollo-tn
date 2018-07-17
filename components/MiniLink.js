import React from 'react'
import NextLink from 'next/link'

import styled from 'styled-components'
const Link = styled.a`
  text-decoration: none;
  color: #545c65;
  transition: all .3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 13px;
  font-size: 16px;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    font-size: 20px;
  }
`

export default (props) => (
  <NextLink href={props.href} passHref>
    <Link>{ props.children }</Link>
  </NextLink>
)
