import React from 'react'
import {Editor, EditorState, SelectionState, Modifier, ContentState} from 'draft-js'
import styled, {keyframes} from 'styled-components'
import { clearEditorContent } from 'draftjs-utils'
import Textarea from 'react-textarea-autocomplete'
const Create = styled.div`
  width: 100%;
  min-height: 160px;
  flex-shrink: 0;
`

const EditorWrap = styled.div`
  background-color: #FFF;
  border-radius: 3px;
  padding: .4em;
`

class NoteEditor extends React.Component {
  state = {editorState: EditorState.createEmpty()}
  onChange = (editorState) => this.setState({editorState})

  handleKeyCommand = (command) => {
    if (command === 'split-block') {
      // alert()
      // return 'handled';
      // this.reset()
    }
  }

  keyBindingFn = (e) => {
    if (e.keyCode === 13) {
      this.reset()
    }
  }

  reset = () => {
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''), 'remove-range')
    this.setState({ editorState })
  }

  render () {
    return (
      <Create>
        <EditorWrap>
          <Textarea
            styleItemActive={{ background: 'orangered', fontSize: '12px' }}
            styleItemInactive={{ fontSize: '12px' }}

            char='#'
            list={[
              'cool',
              'genial',
              'interesante',
              'super',
              'curso',
              'nice',
              'wacamole',
              'fresa',
              'manzana',
              'mango',
              'melon',
              'melocoton',
              'piña',
              'pera',
              'frambuesa',
              'durazno',
              'kiwi',
              'chabacano',
              'blackberry',
              'watermelon',
              'kiwi',
              'chili',
              'lemon',
              'orange',
              'pineaple'
            ]}
          />
        </EditorWrap>
      </Create>
    )
  }
}

export default NoteEditor
