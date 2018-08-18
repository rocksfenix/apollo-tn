import React, {Component} from 'react'
import styled from 'styled-components'
import TextField from '../../../components/TextField'
import Textarea from '../../../components/Textarea'
import Multioption from '../../../components/Multioption'
import ToggleField from '../../../components/ToggleField'
import TagsField from '../../../components/TagsField'

const Panel = styled.div`
  width: 600px;
  height: 100%;
  margin: 0 auto;
  background-color: #FFF;
  padding-top: 1em;
`

const Fields = styled.div`
  width: 80%;
  margin: 1em auto;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const Column = styled.div`
  width: 50%;
`

class LessonEditor extends Component {
  render () {
    if (!this.props.show) return null
    return (
      <Panel>
        <Fields>
          <TextField
            size='medium'
            label='Title'
            keyName='title'
            value={this.props.lesson.title}
            onChange={this.props.onChange}
          />
          <TextField
            size='small'
            label='Slug'
            keyName='slug'
            value={this.props.lesson.slug}
            onChange={this.props.onChange}
          />
          <Textarea
            label='Synopsis'
            keyName='synopsis'
            value={this.props.lesson.synopsis}
            onChange={this.props.onChange}
          />
          <TextField
            size='small'
            label='Video Source'
            keyName='videoSource'
            value={this.props.lesson.videoSource}
            onChange={this.props.onChange}
          />
          <TextField
            size='small'
            label='Tech'
            keyName='tech'
            value={this.props.lesson.tech}
            onChange={this.props.onChange}
          />
          <TextField
            size='small'
            label='Tech Version'
            keyName='techVersion'
            value={this.props.lesson.techVersion}
            onChange={this.props.onChange}
          />
          <TextField
            size='small'
            label='Duration'
            keyName='duration'
            value={this.props.lesson.duration}
            onChange={this.props.onChange}
          />
          <Multioption
            label='role'
            keyName='role'
            active={this.props.lesson.role}
            options={[
              { value: 'pro' },
              { value: 'free' },
              { value: 'public' }
            ]}
            onChange={this.props.onChange}
          />
          <Row>
            <Column>
              <ToggleField
                label='Is Published'
                keyName='isPublished'
                active={this.props.lesson.isPublished}
                onChange={this.props.onChange}
              />
            </Column>
            <Column>
              <ToggleField
                label='Is Transcription Public'
                keyName='isTranscriptionPublic'
                active={this.props.lesson.isTranscriptionPublic}
                onChange={this.props.onChange}
              />
            </Column>
          </Row>
          <TagsField
            label='tags'
            keyName='tags'
            onChange={this.props.onChange}
            tags={this.props.lesson.tags}
          />
        </Fields>
      </Panel>
    )
  }
}

export default LessonEditor
