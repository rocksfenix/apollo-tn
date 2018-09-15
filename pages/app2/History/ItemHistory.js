import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Router from 'next/router'

const Anima = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`

const CoverPanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: row;
  padding-left: 1em;
`

const CoverImg = styled.img`
  width: 20px;
  max-width: 150px;
  will-change: width;

  &:hover {
    transform: scale(1.1);
  }
`

const TitleBlock = styled.div`
  padding-left: .7em;
`

const Title = styled.div`
  color: #333;
  font-weight: bold;
  font-size: 15px;
  transition: all .2s ease-in;

  @media (max-width:900px) {
    font-size: 15px;
  }
`

const ItemBox = styled.div`
  width: 100%;
  flex-shrink: 0;
  z-index: 500;
  font-size: 11px;
  border-bottom: 1px solid whitesmoke;
  display: flex;
  align-items: center;
  position: relative;
  background-color: #FFF;
  animation: ${p => p.animated ? `.4s ease-out ${Anima}` : ''};
  animation-fill-mode: forwards;
  padding: .5em 0;

  @media screen and (orientation: landscape) and (max-width: 900px) {
    min-height: ${p => p.expanded ? '55px' : '100px'};
  };

  @media screen and (orientation: portrait) and (max-width: 900px) {
    min-height:  ${p => p.expanded ? '55px' : '100px'};
  };

  @media (min-width: 900px){
    min-height: 55px;
  };

  :hover {
    background-color: #f3f3f3;
  }
`

const AnimaPlay = keyframes`
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
`

const PlayBox = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background-color: ${p => p.color || '#fe6a0c'};
  position: absolute;
  right: 1em;
  animation: 1.2s ease-out ${AnimaPlay};
  will-change: transform, opacity;
  display: flex;
  justify-content: center;
  align-items: center;

  & > i {
    color: #FFF;
    font-size: 11px;
    position: relative;
    left: 1px;
  }
`

const Play = ({ color }) => (
  <PlayBox color={color}>
    <i className='icon-play' />
  </PlayBox>
)

const ColorBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: ${p => p.color || '#FFF'};
  opacity: 0.07;
  z-index: -1;
`

const LesonTitle = styled.div`
  color: gray;
  display: ${p => p.show ? 'block' : 'none'};
  font-size: 14px;

  @media (max-width:900px) {
    font-size: 13px;
  }
`

export default class extends Component {
  handleClick = () => {
    // Current es la leccion actual
    const { current, item } = this.props
    const { courseSlug, lessonSlug } = item

    if (current) {
      this.props.hideSidebar()
    } else {
      Router.push(
        `/app2?tab=curso&curso=${courseSlug}&lesson=${lessonSlug}`,
        `/app2/curso/${courseSlug}/${lessonSlug}`
      )
      // Se empujan los cambios al App
      // TODO - Con el cambio de arquitectura basado en Query
      // Posiblemente no se requiera
      this.props.onChangeCourse(courseSlug, lessonSlug)
    }
  }

  render () {
    const { expanded, item, animated, isMobile, current, color } = this.props
    return (
      <ItemBox expanded={expanded} animated={animated} onClick={this.handleClick}>
        <CoverPanel expanded={expanded} isMobile={isMobile}>
          <CoverImg
            src={`https://dxpdcvj89hnue.cloudfront.net/cover/${item.courseSlug}-s50`}
          />
          <TitleBlock>
            <Title expanded={expanded}>{item.lessonTitle}</Title>
            <LesonTitle show>{item.courseTitle}</LesonTitle>
          </TitleBlock>
        </CoverPanel>
        { current ? <Play color={color} /> : null }
        { current ? <ColorBox color={color} /> : null }
      </ItemBox>
    )
  }
}
