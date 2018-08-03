import React, { Component } from 'react'
import styled from 'styled-components'
import rem from './util/rem'
import { lightVioletRed, violetRed } from './util/colors'
import { bodyFont, headerFont } from './util/fonts'

  /* font-family: ${bodyFont}; */
  /* font-family: Roboto; */
const Note = styled.div`
  padding: ${rem(7)} ${rem(10)} ${rem(5)} ${rem(14)};
  border-left: ${rem(4)} solid ${violetRed};
  margin: ${rem(45)} 0;
  border-radius: ${rem(3)};
  border-left: 0.222222rem solid #00b6ff;
  border-left: 0.222222rem solid rgb(220, 221, 224);
    font-style: italic;
    width: 85%;
    margin: 2em auto;
  > p {
    margin: 0 0 ${rem(5)} 0;
  }

  &> p > span {
    font-weight: bold;
    background-color: #ebdef7;
    font-size: 95%;
    padding: 0 0.5em;
  }
`

const NoteLabel = styled.strong`
  display: block;
  font-weight: 600;
  font-family: ${headerFont};
  text-transform: uppercase;
  font-size: 90%;
  margin-bottom: ${rem(7)};
`
const Image = styled.img`
  width: 100px;
  opacity: 0.8;
`

const getCleanItems = (children, label) => {
  const items = React.Children.map(children, child => {
    return React.cloneElement(
      {
        ...child,
        props: {
          ...child.props,
          children: child.props.children.map(c => {
            // if (typeof c === 'string') {
            //   return c.replace(/(WARNING|DANGER|TIP)!/gm, '')
            // }
            // if (typeof c === 'object') {
            //   return c.props.children[0].replace(/(WARNING|DANGER|TIP)!/gm, '')
            // }
            // debugger
            return c
          })
        }
      }
    )
  })
  // debugger
  return items
}

const getQuotesImage = (children) => {
  const ch = children[0].props.children[0]
  let parts = ''
  // debugger
  if (typeof ch === 'string') {
    parts = ch.split('!')[0]
  }
  if (typeof ch === 'object') {
    parts = ch.props.children[0].split('!')[0]
  }
  if (parts.indexOf('DANGER') !== -1) return '/static/quotes-danger.svg'
  if (parts.indexOf('WARNING') !== -1) return '/static/quotes-warning.svg'
  if (parts.indexOf('TIP') !== -1) return '/static/quotes-tip.svg'
  return '/static/quotes-normal.svg'
}

const NoteWrapper = ({ label = '', children }) => (
  <Note>
    <Image src={getQuotesImage(children)} />
    <NoteLabel>{label}</NoteLabel>
    {getCleanItems(children, label)}
  </Note>
)

export default NoteWrapper
