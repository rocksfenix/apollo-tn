import styled, {keyframes} from 'styled-components'
import React, {Component} from 'react'
import TextField from '../../../components/TextField'
import Multioption from '../../../components/Multioption'
import Textarea from '../../../components/Textarea'
import ColorField from '../../../components/ColorField'
import ToggleField from '../../../components/ToggleField'
import TagsField from '../../../components/TagsField'

const animation = keyframes`
  0%{
    transform: scale(.9);
    opacity: 0;
  }
  100%{
    transform: scale(1);
    opacity: 1;
  }
`

const Panel = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  padding-right: 52px;
  background-color: rgba(0, 0, 0, 0.98);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  animation: .3s ease-in-out ${animation};
`

const Fields = styled.div`
  width: 30%;
  height: 100%;
  background-color: #FFF;
  padding-top: 55px;
`

const FieldsWrap = styled.div`
  width: 95%;
  margin: 0 auto;
`

const Buttons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
  background-color: #060507;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonSave = styled.button`
  background-color: blue;
  color: #FFF;
`

export default class extends Component {
  state = {
    course: {
      title: 'The title',
      role: 'pro',
      serieType: 'course',
      description: '',
      category: 'frontend',
      color: '#333',
      isPublished: false,
      isRecording: true
    }
  }

  onChange = (key, value) => {
    this.setState(state => ({
      ...state,
      course: {
        ...state.course,
        [key]: value
      }
    }))
  }

  render () {
    if (!this.props.show) return null
    return (
      <Panel>
        <Fields>
          <FieldsWrap>
            <TextField
              label='title'
              keyName='title'
              size='medium'
              onChange={this.onChange}
              value={this.state.course.title}
            />
            <ColorField
              label='Color'
              keyName='color'
              color={this.state.course.color}
              onChange={this.onChange}
            />
            <Multioption
              label='role'
              keyName='role'
              active={this.state.course.role}
              options={[
                { value: 'pro' },
                { value: 'free' },
                { value: 'public' }
              ]}
              onChange={this.onChange}
            />
            <Multioption
              label='Serie Type'
              keyName='serieType'
              active={this.state.course.serieType}
              options={[
                { value: 'course' },
                { value: 'tutorial' }
              ]}
              onChange={this.onChange}
            />
            <Multioption
              label='Category'
              keyName='category'
              active={this.state.course.category}
              options={[
                { value: 'frontend' },
                { value: 'backend' },
                { value: 'herramientas' }
              ]}
              onChange={this.onChange}
            />
            <TextField
              label='tech'
              keyName='tech'
              size='medium'
              onChange={this.onChange}
              value={this.state.course.tech}
            />
            <TextField
              label='trailer'
              keyName='trailer'
              size='medium'
              onChange={this.onChange}
              value={this.state.course.trailer}
            />
            <TextField
              label='synopsis'
              keyName='synopsis'
              size='medium'
              onChange={this.onChange}
              value={this.state.course.synopsis}
            />
            <Textarea
              label='Description'
              keyName='description'
              onChange={this.onChange}
              value={this.state.course.description}

            />
            <ToggleField
              label='Is Published'
              keyName='isPubliched'
              active={this.state.course.isPublished}
              onChange={this.onChange}
            />
            <ToggleField
              label='Is Recording'
              keyName='isRecording'
              active={this.state.course.isRecording}
              onChange={this.onChange}
            />
            <TagsField
              label='tags'
              tags={[]}
            />
          </FieldsWrap>
        </Fields>
        <Fields></Fields>
        <Fields></Fields>
        <Buttons>
          <ButtonSave onClick={this.props.hideEditor}>Save</ButtonSave>
        </Buttons>
      </Panel>
    )
  }
}
