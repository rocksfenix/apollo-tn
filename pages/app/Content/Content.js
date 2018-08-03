import React from 'react'
import styled from 'styled-components'
import VideoLevelUp from './VideoLevelUp'
import Header from './Header'
import Markdown from '../../../components/md/Markdown'

const Content = styled.div`
  position: relative;
  /* transition: all .3s ease-in-out; */
  `
const MarkdownContent = styled.div`
  max-width: 710px;
  margin: 50px auto;
`

const AditionalButtons = styled.div`
  /* background-color: whitesmoke; */
  border-bottom: 1px solid #f7f7f7;
  height: 55px;
  display: flex;
  justify-content: flex-end;
  text-shadow: 0 0 black;
  align-items: center;
`

const But = styled.button`
  border: ${p => p.border ? '1px solid #222831' : 'initial'};
  border-radius: 3px;
  font-size: 16px;
  padding: .3em 1.3em;
  margin: 0 .3em;
  background-color: #FFF;
  color: rgb(228, 232, 239);
  transition: all .25s ease-out;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    border: 2px solid #efe1fb;
    color: rgb(101, 113, 132);
  }
`
const Button = ({ children, icon, border }) => (
  <But border={border}>
    {children} <i className={icon} />
  </But>
)

export default ({ width, left, course, lesson }) => {
  let current = 0
  course.lessons.forEach((l, index) => {
    // debugger
    if (l.slug === lesson.slug) {
      current = index
    }
  })

  const nextLesson = course.lessons[current + 1] || {}

  const style = {
    width,
    left
  }
  return (
    <Content show style={style}>
      <VideoLevelUp />
      <AditionalButtons>
        <Button icon='icon-snippet'></Button>
        <Button icon='icon-heart-1'></Button>
        <Button icon='icon-arrow-right' border>{ nextLesson.title || 'Curso Completado' }</Button>
      </AditionalButtons>
      <Header course={course} lesson={lesson} />
      <MarkdownContent>
        <Markdown
          markdown={`

          Esto es un gran ejemplo de como una buena leccion se puede convertir en algo verdadermanete especial, al principio puedes darte cuenta que las funciones cambian al hacer una actualizacion, pero es muy importante visualizar y tener esa parte en mente.
          
          Back in 1995, when Nicholas Negroponte wrote Being Digital, his seminal piece on technologically-driven life, facial recognition technology was still a bit of a dream. He felt it was destined to become reality.

          > WARNING! Captain Janeway http://github.com - automatic! [GitHub](http://github.com)

          “Your face is, in effect, your display device, and your computer should be able to read it, which requires the recognition of your face and its unique expressions,” he wrote. “The technical challenge of recognizing faces and facial expressions is formidable. Nevertheless, its realization is eminently achievable in some contexts. In applications that involve you and your computer, it only needs to know if it is you, as opposed to anybody else on the planet.”
          
          > - DANGER! Cuidado al definir *propiedades continuas* porque **pueden probocar** \`<Component />\` ciclos extraños
          
          “Your face is, in effect, your display device, and your computer should be able to read it, which requires the recognition of your face and its unique expressions,” he wrote. “The technical challenge of recognizing faces and facial expressions is formidable. Nevertheless, its realization is eminently achievable in some contexts. In applications that involve you and your computer, it only needs to know if it is you, as opposed to anybody else on the planet.”

          <hr />

          > TIP! ⚛️Esto es otro ejemplo de como pasar props
          ~~~terminal
          npm run dev
          ~~~
          In 2018, this reads as prophetic. Just last year, Apple debuted the iPhone X, which users can choose to unlock by looking at — and thus being recognized by — its camera. Your face is already a password.
          
          Of course, by now we also know a lot about facial recognition’s other use cases. In recent years, facial recognition has been introduced at airports around the United States as a way to confirm travelers’ identities. It was used last month to identify a man who murdered five people at a newspaper office in Maryland, and this month to pinpoint two people suspected of poisoning Russian double-agent Sergei Skripal and his daughter Yulia in the UK. Tech companies are working to create facial recognition software that can, among other things, help a blind person know who’s in a photograph, or even who’s in the room with them. Credit card companies are hoping facial recognition is the next step in payment authentication.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?
          
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?
          
          ~~~terminal
          npm run dev
          ~~~
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?
          > DANGER! Coffee. The finest organic \`\`suspension ever devised...\`\` I beat the Borg with it.t consectetur adipisicing elit.
          
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?
          
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aperiam blanditiis labore inventore vel eveniet expedita sint doloremque nam architecto suscipit ipsam magni laudantium incidunt deserunt, nihil debitis. Quisquam, harum?
          
          ~~~jsx
          App.jsx
          class Login extends Component {
            handleFormSubmit(formProps) {
              this.props.loginUser(formProps);
            }
          
            renderAlert() {
              if (this.props.errorMessage) {
                return (
                  <div>
                    <span><strong>Error!</strong> {this.props.errorMessage}</span>
                  </div>
                );
              }
            }
          
          ~~~
          aces have always been used as a tool of identification. Law enforcement and government have been known to use faces to systematically classify some people apart from others. Yet even in those instances, simply having an image of a face was not the same as knowing everything about someone. But this is what facial recognition does: it enables anyone to assume that looking at someone’s face means knowing them. Surveillance structures are currently being built that would make this assumption by default. Your face was once assumed to hide your secrets. It will no longer be allowed to.

          Still, what facial recognition actually recognizes — a data-based abstraction of our face — can only ever be a superficial portrayal. This is why we feel injustice and fear when we learn of China’s surveillance state, where the names of those guilty of petty crimes like jaywalking are displayed publicly. Because we don’t know the full story. We don’t know why they were jaywalking.
        `}
        />
      </MarkdownContent>
    </Content>
  )
}
