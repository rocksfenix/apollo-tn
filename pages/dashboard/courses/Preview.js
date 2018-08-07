import React, {Component} from 'react'
import styled from 'styled-components'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc'
import getTechIcon from '../../../util/getTechIcon'

const Panel = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
`

const List = styled.ul`
  width: 100%;
  min-height: 300px;
  background: #e9f3f5;
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
  position: relative;
  overflow: hidden;
  font-size: 15px;
`

const Options = styled.div`
  position: absolute;
  right: 0;
  top: ${p => p.show ? '0' : '-100%'};
  width: 50px;
  height: 50px;
  transition: all .3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Delete = styled.button`
  border: 0;
  cursor: pointer;
  opacity: .5;

  &:hover {
    opacity: 1;
  }
`

const IconDelete = styled.i`
  color: #fd6519;
`

const CoverImage = styled.img`
  width: 100px;
  margin: 0 auto;
  display: block;
  margin-bottom: 1em;
`

const Header = styled.div`
  background: ${p => p.color};
  width: 100%;
  height: 50px;
  border-radius: 43px 43px 0 0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ShadowImage = styled.img`
  width: 32%;
  position: absolute;
  right: 0;
  top: 0;
`

const Gradient = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  bottom: 0px;
  left: 0px;
  position: absolute;
  background: linear-gradient(120deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.58));
  border-radius: 20px 20px 0px 0px;
`

const TechBox = styled.div`
  width: 30px;
  height: 30px;
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1em;
  position: relative;
  z-index: 10;
`

const TechImage = styled.img`
  width: 50%;
`

const CourseTitle = styled.div`
  color: #FFF;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.36);
  position: relative;
  z-index: 100;
  font-size: 15px;
`

class Item extends Component {
  state = { show: false }
  showOptions = () => {
    this.setState({ show: true })
  }

  hideOptions = () => {
    this.setState({ show: false })
  }

  render () {
    return (
      <Box
        onMouseOver={this.showOptions}
        onMouseLeave={this.hideOptions}
      >{ this.props.title }
        <Options show={this.state.show}>
          <Delete
            onClick={() => this.props.onDelete(this.props)}
          ><IconDelete className='icon-remove' /></Delete>
        </Options>
      </Box>
    )
  }
}

const SortableItem = SortableElement((props) => <Item {...props} onDelete={props.onDelete} />)

const SortableList = SortableContainer(({items, onDelete}) => {
  return (
    <List>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} {...item} onDelete={onDelete} />
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
        <CoverImage src={this.props.course.cover.medium} />
        <Header color={this.props.course.color}>
          <Gradient />
          <ShadowImage src='/static/shadow-1.svg' />
          <TechBox>
            <TechImage src={getTechIcon(this.props.course.tech)} />
          </TechBox>
          <CourseTitle>{ this.props.course.title }</CourseTitle>
        </Header>
        <SortableList
          items={this.props.lessons}
          onSortEnd={this.onSortEnd}
          onDelete={this.props.onDelete}
        />
      </Panel>
    )
  }
}
