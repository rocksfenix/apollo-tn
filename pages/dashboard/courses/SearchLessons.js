import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import gql from 'graphql-tag'
import includes from 'lodash/includes'
import some from 'lodash/some'

import Search from '../Search'

const LESSONS = gql`
 query allLessons($first: Int, $skip: Int, $text: String) {
    allLessons (first: $first, skip: $skip, text: $text) {
      lessons {
        slug
        title
        _id
        screenshot {
          small
        }
      }
      total
    }
  }

`

const Panel = styled.div`
  background-color: yellow;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
`

const SearchBox = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Items = styled.ul`
  padding: 0;
`

const ItemBox = styled.li`
  list-style: none;
  background-color: #FFF;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  padding: .2em 1em;
  cursor: pointer;
`
const Item = (props) => (
  <ItemBox onClick={props.onClick}>
    {props.title}

    { props.isSelected
      ? (
        <Ball>
          <IconBall className='icon-success' />
        </Ball>
      )
      : null
    }
  </ItemBox>
)

const IconBall = styled.i`
  color: #FFF;
  font-size: 11px;
`

const Ball = styled.div`
  width: 21px;
  height: 21px;
  background-color: #00fbff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`

export default class extends Component {
  state = {
    isFetching: false,
    lessons: [],
    selected: []
  }
  onSearch = async (text) => {
    this.setState({ isFetching: true })

    const result = await this.props.client.query({
      query: LESSONS,
      variables: {
        first: this.state.itemsByPage,
        skip: 0,
        text
      }
    })

    this.setState({
      lessons: result.data.allLessons.lessons,
      total: result.data.allLessons.total,
      isFetching: false
    })
  }

  addLesson = (lesson) => {
    // Si existe la elimina, si no existe la agrega
    const { lessons } = this.props


    const exist = some(lessons, { _id: lesson._id })

    if (!exist) {
      // Agregar
      this.props.onClickLesson([ ...lessons, lesson ])
    } else {
      // Eliminar
      this.props.onClickLesson(lessons.filter(l => l._id !== lesson._id))
    }
    // console.log(lesson, some(lessons, { _id: lesson._id }))
    // this.setState(state => ({
    //   ...state,
    //   selected: [ ...state.selected, lesson._id ]
    // }))

    // this.props.onClickLesson(lesson)
  }

  render () {
    console.log(this.props)

    return (
      <Panel>
        <SearchBox>
          <Search
            style={{
              background: '#FFF',
              padding: '1px 2px',
              width: '90%'
            }}
            onSeach={this.onSearch}
          />
        </SearchBox>
        <Items>
          {this.state.lessons.map(lesson => (
            <Item
              {...lesson}
              isSelected={includes(this.props.lessons.map(l => l._id), lesson._id)}
              key={lesson._id}
              onClick={() => this.addLesson(lesson)}
            />
          ))}
        </Items>
      </Panel>
    )
  }
}
