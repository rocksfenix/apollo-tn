import React, {Component} from 'react'
import styled from 'styled-components'
import { Ellipsis } from '../../../../components/Spinners'

/* filter: ${p => p.show ? 'blur(0px)' : 'blur(7px)'}; */
const Panel = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #FFF;
  position: absolute;
  left: ${p => p.show ? '280px' : '-100%'};
  bottom: 55px;
  z-index: -1;
  transition: left .25s ease-out;
  box-shadow: 0 5px 5520px #0b0d15;
  box-shadow: 0 0 169px #505569;
`

const ButtonPlay = styled.button`
  border: ${p => p.focus ? '2px solid #00b8ff' : '2px solid transparent'};
`

const Item = styled.li`
  border: ${p => p.focus ? '2px solid #00b8ff' : '2px solid transparent'};
`

const CoverImg = styled.img`
  width: 100px;
`

export default class extends Component {
  render () {
    const { courseInFocus, courseDetails, index2, detailsFetching } = this.props
    const { courseTitle, description, cover } = courseInFocus
    const { lessons } = courseDetails

    // console.log('COURSE IN FOCUS ', courseInFocus)

    return (
      <Panel show={this.props.show}>
        <CoverImg src={cover.medium} />
        <h3>{ courseTitle }</h3>
        <p>{ description }</p>
        <ButtonPlay
          focus={index2 === 0}
        >Reproducir <i className='icon-play-1' /></ButtonPlay>
        { detailsFetching
          ? <Ellipsis width='100px' show />
          : (
            <ol>
              {lessons.map((lesson, index) => (
                <Item focus={index === index2 - 1} key={lesson._id}>{ lesson.title }</Item>
              ))}
            </ol>
          )
        }
      </Panel>
    )
  }
}
