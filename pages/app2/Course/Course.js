import React, {Component} from 'react'
import styled from 'styled-components'
import Transcription from './Transcription'
import Coursebar from './Coursebar'

const Panel = styled.section`
  width: 100%;
  height: 100vh;
  padding-left: 55px;
  overflow-x: hidden;
  display: flex;
  background-color: #FFF;

  @media (max-width:900px) {
    padding-left: 0;
  }
`
export default class extends Component {
  render () {
    return (
      <Panel>
        <Coursebar
          {...this.props}
          // size={this.props.panelSize}
          // onChangeLesson={this.props.onChangeLesson}
          // lessonSlug={this.props.lesson.slug}
          // coursebarHeight={'100'}
          // setScroll={this.props.setScroll}
          // onLessonsSetScroll={this.props.onLessonsSetScroll}
          // course={this.props.course}
        />
        <Transcription
          {...this.props}
          // width={this.props.contentWidth}
          // left={this.props.contentLeft}
          // lesson={this.props.lesson}
          // course={this.props.course}
        />
      </Panel>
    )
  }
}
