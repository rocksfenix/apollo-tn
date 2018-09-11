/*
 * This is totally an adapted version of react-markings, but we need to be able
 * to render custom elements for each markdown feature to make contributions reasonably easy
 * See: https://github.com/Thinkmill/react-markings
 */

import React, { Children } from 'react'
import styled, {keyframes} from 'styled-components'
import { Parser } from 'commonmark'
import Renderer from 'commonmark-react-renderer'
import Zoom from 'react-medium-image-zoom'
import copy from 'copy-to-clipboard'

import stripIndent from './util/stripIndent'
import elementToText from './util/elementToText'
import titleToDash from './util/titleToDash'

// Components to be used as renderers
import Code from './Code'
import Terminal from './Terminal'
import CodeBlock from './CodeBlock'
import Note from './Note'
import Link from './Link'
import { Title } from './Layout'
import Anchor from './Anchor'
import Label, { LabelGroup } from './Label'
import Paragraph from './Paragraph'

const PLACEHOLDER = 'THIS_IS_A_BUG_PLEASE_OPEN_AN_ISSUE_IN_OUR_WEBSITE_REPO'

const ImageBlock = styled.div`
  height: 400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width:900px) {
    height: 270px;
  } 
`

const isValid = node => {
  const walker = node.walker()
  let event

  while (event = walker.next()) {
    const { node, entering } = event

    if (
      !entering ||
      !node.literal ||
      node.literal.indexOf(PLACEHOLDER) === -1 ||
      (
        node.type === 'text' &&
        node.parent.type === 'paragraph' &&
        node.literal === PLACEHOLDER
      )
    ) {
      continue
    }

    return false
  }

  return true
}

const md = (strings, values) => {
  // Check if it's called as a normal function or as a tagged function
  const input = typeof strings === 'string'
    ? stripIndent(strings)
    : stripIndent(strings.join(PLACEHOLDER))

  const idPrefix = typeof strings === 'string' && typeof values[0] === 'string'
    ? values[0] + '_' : ''

  const startingLevel = typeof strings === 'string'
    ? values[1] : null

  const parser = new Parser()
  const ast = parser.parse(input)

  // console.log(ast)

  if (!isValid(ast)) {
    throw new Error('Cannot interpolate React elements non-block positions')
  }

  let topLevelHeading

  const onCopy = (e) => {
    // alert(e)
    copy(e.text)
    console.log(e)
  }

  const renderer = new Renderer({
    renderers: {
      Paragraph ({ children }) {
        if (
          (Array.isArray(children) && children.length === 1 && children[0] === PLACEHOLDER) ||
          children === PLACEHOLDER
        ) {
          return values.shift()
        }

        return (
          <Paragraph>
            {children}
          </Paragraph>
        )
      },

      Code ({ literal }) {
        return <Code>{literal}</Code>
      },

      CodeBlock ({ language, literal }) {
        const endLine = literal.indexOf('\n')
        const filename = literal.slice(0, endLine)
        const code = literal.substr(endLine + 1, literal.length)

        if (language === 'terminal' && process.browser) {
          return <Terminal language={language} literal={literal} onCopy={onCopy} {...values} />
        }

        return <CodeBlock onCopy={onCopy} code={code} language={language} filename={filename} {...values} onChange={(e) => console.log(e)} />
      },

      BlockQuote (p) {
        // debugger
        return <Note>{p.children}</Note>
      },

      Link ({ href, children }) {
        return <Link href={href} inline>{children}</Link>
      },

      Image ({ src, title, alt }) {
        return (
          <ImageBlock>
            <Zoom
              style={{ zIndex: 2000 }}
              image={{
                src,
                alt,
                className: 'img',
                style: { maxHeight: '100%', maxWidth: '100%', margin: '0 auto', display: 'block' }
              }}
              zoomImage={{
                src,
                alt,
                style: { width: '100%' }
              }}
            />
          </ImageBlock>
        )
      },

      Heading ({ level, children }) {
        if (startingLevel) {
          topLevelHeading = topLevelHeading || Math.max(level, 1)
          level += startingLevel - topLevelHeading
        }

        if (level === 1) {
          return <Title>{children}</Title>
        }

        // The pipe indicates labels after the initial title
        const [_, ...labels] = elementToText(children).split('|')

        const title = Children.map(children, child => {
          if (typeof child === 'string') {
            const pipeIndex = child.indexOf('|')
            return pipeIndex > -1 ? child.slice(0, pipeIndex) : child
          }

          return child
        })

        const hash = `${idPrefix}${titleToDash(title)}`
        // console.log(hash)

        return (
          <Anchor id={hash} level={level}>
            {title}
            {labels.length > 0 && (
              <LabelGroup>
                {
                  labels.map((label, index) =>
                    <Label key={index}>
                      {label.trim()}
                    </Label>
                  )
                }
              </LabelGroup>
            )}
          </Anchor>
        )
      }
    }
  })

  return (
    <div>
      {renderer.render(ast)}
    </div>
  )
}

export default md
