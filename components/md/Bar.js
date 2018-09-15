import React, {Component} from 'react'
import styled from 'styled-components'
// import Notify from './Notify'
import copy from 'copy-to-clipboard'
import { saveAs } from 'file-saver/FileSaver'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import moment from 'moment'

moment.lang('es')

const SNIPPET_CREATE = gql`
  mutation snippetCreate($input: SnippetCreate) {
    snippetCreate(input: $input) {
      _id
      lang
      filename
      code
      author
      lessonTitle
      courseTitle
      lessonSlug
      courseSlug
    }
  }
`

const SNIPPETS = gql`
  query snippets($limit: Int, $offset: Int) {
    snippets(limit: $limit, offset: $offset) @connection(key: "snippets") {
      items {
        _id
        lang
        filename
        code
        author
        lessonTitle
        courseTitle
        lessonSlug
        courseSlug
      }
      hasMore
    }
  }
`

const Bar = styled.div`
  width: 100%;
  height: 40px;
  background: #111218;
  border-radius: 5px 5px 0 0;
  padding: 0 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
  margin-top: 3em;
  margin-left: auto;
  margin-right: auto;
  font-size: 15px;
  color: #706d75;
  position: relative;
  width: 95%;

  @media (max-width: 768px) {
    width: 95%
  }
`

const BallsPanel = styled.div`
  width: 65px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const Ball = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${props => props.color || '#272931'};
  border-radius: 50%;
`
const Icon = styled.img`
  height: 20px;
  margin-right: 0.5em;
`

const Balls = ({ colors = [] }) => (
  <BallsPanel>
    <Ball color={colors[0]} />
    <Ball color={colors[1]} />
    <Ball color={colors[2]} />
  </BallsPanel>
)

const Buttons = styled.div`
  width: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const IconBtn = styled.i`
  color: gray;
  color: #4d475b;
`

const Button = styled.button`
  border: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  &:hover > i {
    color: #5856c0;
    color: #00b6ff;
  }
`

class BarComponent extends Component {
  onFavorite = async () => {
    const { language, literal, code, filename, lesson, course } = this.props

    // Curso
    const preCode = `/*
 * Snippet del curso ~ ${course.title}
 * https://tecninja.io/app/curso/${course.slug}/${lesson.slug}
 * ${moment().format('MMMM D YYYY, h:mm:ss a')}
 */

`

    const input = {
      lang: language || 'javascript',
      filename: filename || 'snippet.js',
      code: preCode + (literal || code),
      lessonTitle: lesson.title,
      courseTitle: course.title,
      lessonSlug: lesson.slug,
      courseSlug: course.slug
    }

    const res = await this.props.client.mutate({
      mutation: SNIPPET_CREATE,
      variables: { input }
    })

    // Actualizar cache
    try {
      const {snippets} = this.props.client.readQuery({ query: SNIPPETS })
      if (snippets) {
        this.props.client.writeQuery({
          query: SNIPPETS,
          data: {
            snippets: {
              ...snippets,
              items: [res.data.snippetCreate, ...snippets.items]
            }
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  onCopy = () => {
    const { literal, code } = this.props
    const text = literal || code
    copy(text)
  }

  onDownload = () => {
    const { language, literal, code, filename, lesson, course } = this.props
    const preCode = `/*
 * Snippet del curso ~ ${course.title}
 * https://tecninja.io/app/curso/${course.slug}/${lesson.slug}
 * ${moment().format('MMMM D YYYY, h:mm:ss a')}
 */

`
    const finalCode = preCode + (literal || code)
    var blob = new window.Blob([finalCode], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, filename || 'file')
  }

  render () {
    const { colors = [], filename = 'terminal', icon } = this.props

    return (
      <Bar>
        <Balls colors={colors} />
        <div>
          { icon ? <Icon src='/static/react.svg' /> : ''}
          { filename }
        </div>
        <Buttons>
          <Button onClick={this.onFavorite}>
            <IconBtn className='icon-snippet' />
          </Button>
          <Button onClick={this.onCopy}>
            <IconBtn className='icon-copy' />
          </Button>
          <Button onClick={this.onDownload}>
            <IconBtn className='icon-download' />
          </Button>
        </Buttons>
      </Bar>
    )
  }
}

export default withApollo(BarComponent)
