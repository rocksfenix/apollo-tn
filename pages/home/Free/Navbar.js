import React, {Component} from 'react'
import styled from 'styled-components'
// import { timesSeries } from '../../../node_modules/@types/async';

const Panel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 100vh;
  /* border-right: 1px solid #181818; */
  z-index: 2000;
  background-color: #11131e;
  color: #aaa;
  width: 55px;
  overflow: hidden;
  transition: width .09s ease-in-out, box-shadow .15s ease-in-out;
`

const Image = styled.img`
  width: 40px;

`

const BrandItem = styled.div`
  width: 200px;
  height: 55px;
  border-bottom: 1px solid black;
  display: flex;
  align-items: center;
`

const Item = styled.div`
  width: 200px;
  height: 55px;
  color: ${props => props.active ? '#25fff8' : ''};

  &:hover {
    background-color: rgba(20,7,53);
    color: #FFF;

    &>div>i {
      color: #9389f7;
    }
  }
`

const ItemText = styled.div`
  position: relative;
  transition: all .2s ease-out;
  left: ${props => props.show ? '0px' : '20px'};
  height: 55px;
  /* background-color: red; */
  display: flex;
  align-items: center;
`

const Tecninja = styled.div`
  position: relative;
  transition: all .4s ease-out;
  left: ${props => props.show ? '10px' : '30px'};
  height: 55px;
  /* background-color: red; */
  display: flex;
  align-items: center;
  color: #FFF;
`
// http://192.168.1.96:8080/#curso/react-router-v4/primera-ruta
const IconBox = styled.div`
  height: 55px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  font-size: 22px;
  color: #9389f7;
`

class Navbar extends Component {
  state = {
    width: '55px',
    show: false,
    route: {}
  }

  componentWillMount = () => {
    // const route = window.location.hash.split('/')
    // const tab = route[1]
    // const course = route[2]
    // const lesson = route[3]
    // console.log(`
    //   tab: ${tab}
    //   course: ${course}
    //   lesson: ${lesson}
    // `)

    // this.setState({ tab, course, lesson })
    
  }
  
  // componentDidMount = () => {
  //   console.log(window.location.hash)

  // }

  // state = { width: '200px', show: true }
  // onMouseEnter = (e) => {
  //   console.log('OVER')
  //   this.setState({ width: '200px', show: true })
  // }
  // onMouseLeave = (e) => {
  //   console.log('LEAVE')
  //   this.setState({ width: '55px', show: false })
  // }
  render () {
    const styles = {
      width: this.state.width,
      boxShadow: this.state.show ? '10px 0 181px rgba(0,0,0,0.8)' : ''
      // color: this.state.show ? '#fff' : '#aaa'
    }
    console.log(this.state)
    return (
      <Panel
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={styles}
      >
        <BrandItem>
          <IconBox>
            <Image
              src='/static/tecninja.io-logo.svg'
              alt='Logo de Tecninja.io'
            />
          </IconBox>

          <Tecninja show={this.state.show}>Tecninja.io</Tecninja>
        </BrandItem>
        <Item >
          <IconBox>
            <i className='icon-history' />
          </IconBox>
          <ItemText show={this.state.show}>Home</ItemText>
        </Item>
        <Item>
          <IconBox>
            <i className='icon-play-2' />
          </IconBox>
          <ItemText show={this.state.show}>Cursos</ItemText>
        </Item>
        <Item active>
          <IconBox>
            <i className='icon-favorite' />
          </IconBox>
          <ItemText show={this.state.show}>Favoritos</ItemText>
        </Item>
        <Item>
          <IconBox>
            <i className='icon-snippet' />
          </IconBox>
          <ItemText show={this.state.show}>Snippets</ItemText>
        </Item>
        <Item>
          <IconBox>
            <i className='icon-notes' />
          </IconBox>
          <ItemText show={this.state.show}>Notas</ItemText>
        </Item>
        <Item>
          <IconBox>
            <i className='icon-bookmark' />
          </IconBox>
          <ItemText show={this.state.show}>Bookmarks</ItemText>
        </Item>
        <Item>
          <IconBox>
            <i className='icon-home' />
          </IconBox>
          <ItemText show={this.state.show}>Bookmarks</ItemText>
        </Item>
      </Panel>
    )
  }
}

export default Navbar
