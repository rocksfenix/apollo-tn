import React from 'react'
import styled from 'styled-components'
import VideoLevelUp from './VideoLevelUp'
import Header from './Header'

const Content = styled.div`
  position: relative;
  /* transition: all .3s ease-in-out; */
  `
const MarkdownContent = styled.div`
  max-width: 750px;
  margin: 50px auto;
`

export default ({ width, left, course, lesson }) => {
  const style = {
    width,
    left
  }
  return (
    <Content show style={style}>
      <VideoLevelUp />
      <MarkdownContent>
        <Header course={course} lesson={lesson} />
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?</p>
      </MarkdownContent>
    </Content>
  )
}
