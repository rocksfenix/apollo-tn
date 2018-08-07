import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'


const Panel = styled.div`
  background-color: yellow;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
`


const List = styled.ul`
  width: 100%;
  min-height: 300px;
  background: #9cb6b5;
  margin: 0;
  padding: 0;
`

const Box = styled.li`
  width: 100%;
  padding: .7em 1em;
  margin: 0 auto;
  display: block;
  background: #FFF;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  z-index: 2000;
`

const SortableItem = SortableElement((props) => <Box {...props}>{ props.title }</Box>)

const SortableList = SortableContainer(({items}) => {
  return (
    <List>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} {...item} />
      ))}
    </List>
  )
})

export default class extends Component {
  onSortEnd = ({oldIndex, newIndex}) => {
    const lessons = arrayMove(this.props.lessons, oldIndex, newIndex)
    this.props.onSortEnd(lessons)
  }
  render () {
    if (!this.props.lessons) return null
    return (
      <Panel>
        <SortableList
          items={this.props.lessons}
          onSortEnd={this.onSortEnd}
        />
      </Panel>
    )
  }
}
