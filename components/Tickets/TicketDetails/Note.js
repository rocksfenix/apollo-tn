import React, { Component } from 'react'
import DOM from 'react-dom'
import styled from 'styled-components'
import moment from 'moment'
import Avatar from '../../Avatar'

moment.locale('es')

const NoteBox = styled.div`
  width: 100%;
  padding: .5em;
  cursor: pointer;
  transition: .2s ease-out;
  border-radius: 3px;
  flex-direction: column;

  :hover {
    background: #e9f3f5;
  }
`

const TimeNote = styled.span`
  font-size: 13px;
  color: #c5c5c5;
  font-weight: 100;
`
const Footer = styled.div`
  display: flex;
  justify-content: space-space-between;
  align-items: center;
  justify-content: space-between;
`

const AuthorName = styled.span`
  font-size: 10px;
  margin: 0 .5em;
`

const NoteText = styled.div`
  max-width: 90%;
  height: auto;
  font-size: 15px;
  margin: 0 1em;
`

const EditBox = styled.div`
  width: 100%;
`

const Input = styled.input`
  width: 95%;
  border: 1px solid #333;
  outline: none;
  border-radius: 2px;
  padding: 0 .3em;

`

const DeleteBtn = styled.button`
  width: 5%;
  border: 0;
  background-color: #ffdede;
  color: #cb6c6c;
  cursor: pointer;
  outline: none;

  :hover {
    background: tomato;
    color: #FFF;
  }
`

const Body = styled.div`
  display: flex;
  justify-content: space-space-between;
  align-items: center;
`

class EditPanel extends Component {
  componentDidMount () {
    const input = DOM.findDOMNode(this.input)
    input.focus()
    input.value = this.props.note.text

    this.input = input
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 27) {
      // Escape
      this.discart()
    }

    if (e.key === 'Enter') {
      this.props.onConfirm({
        ...this.props.note,
        text: this.input.value
      })
    }
  }

  discart = () => this.props.onDiscart()

  delete = () => this.props.onDelete(this.props.note._id)

  render () {
    return (
      <EditBox>
        <Input
          ref={input => { this.input = input }}
          onKeyDown={this.handleKeyPress}
        />
        <DeleteBtn onClick={this.delete}>
          <i className='icon-remove' />
        </DeleteBtn>
      </EditBox>
    )
  }
}

class NoteComponent extends Component {
  state = { isEditing: false }

  activeEdit = () => {
    this.setState({ isEditing: true })
  }

  discart = () => {
    this.setState({ isEditing: false })
  }

  confirm = (note) => {
    this.setState({ isEditing: false })
    this.props.onConfirm(note)
  }

  delete = (_id) => {
    this.setState({ isEditing: false })
    this.props.onDelete(_id)
  }

  render () {
    const { isEditing } = this.state
    const { note } = this.props

    if (isEditing) {
      return <EditPanel
        note={note}
        onDiscart={this.discart}
        onConfirm={this.confirm}
        onDelete={this.delete}
      />
    }

    return (
      <NoteBox onDoubleClick={this.activeEdit}>
        <Body>
          <Avatar src={note.author.avatar.s100} size='20px' />
          <NoteText>{ note.text }</NoteText>
        </Body>
        <Footer>
          <AuthorName>{note.author.fullname}</AuthorName>
          <TimeNote>
            {moment(note.createdAt).format('D - MMMM - YYYY, h:mm:ss a')}( {moment(note.createdAt).fromNow()} )
          </TimeNote>
        </Footer>
      </NoteBox>
    )
  }
}

export default NoteComponent
