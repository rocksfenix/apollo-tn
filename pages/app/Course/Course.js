import React, {Component} from 'react'
import styled from 'styled-components'
import Content from './Content'
import Coursebar from './Coursebar'

const Panel = styled.section`
  width: 100%;
  padding-left: 55px;
  overflow-x: hidden;
`
export default class extends Component {
  render () {
    return (
      <Panel>
        <Coursebar
          show
          size={this.props.panelSize}
          onChangeLesson={this.props.onChangeLesson}
          lessonSlug={this.props.url.lesson}
          coursebarHeight={this.props.coursebarHeight}
          setScroll={this.props.setScroll}
          onLessonsSetScroll={this.props.onLessonsSetScroll}
          course={this.props.course}
        />
        <Content
          width={this.props.contentWidth}
          left={this.props.contentLeft}
          lesson={this.props.lesson}
          course={this.props.course}
        />
      </Panel>
    )
  }
}
