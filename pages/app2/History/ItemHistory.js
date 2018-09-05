import React, {Component} from 'react'
import styled, {keyframes} from 'styled-components'
import Router from 'next/router'
// import getTechIcon from '../getTechIcon'
// import slugify from 'slugify'

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
  width: ${p => {
    if (p.size === 'mini' || p.size === 'full') return '20px'
  }};
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
  font-size: ${p => p.size === 'playing' ? '17px' : '15px'};
  transition: all .2s ease-in;

  @media (max-width:900px) {
    font-size: 15px;
  }
`

const LesonTitle = styled.div`
  color: gray;
  display: ${p => p.show ? 'block' : 'none'};
  font-size: 14px;

  @media (max-width:900px) {
    font-size: 13px;
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

  @media screen and (orientation: landscape) and (max-width: 900px){
    min-height:  ${p => {
    if (p.size === 'mini') return '100px'
    if (p.size === 'full') return '55px'
  }};
  };

  @media screen and (orientation: portrait) and (max-width: 900px) {
    min-height:  ${p => {
    if (p.size === 'mini') return '100px'
    if (p.size === 'full') return '55px'
  }};
  };
  }

  @media (min-width: 900px){
    min-height: 55px;
  };

  :hover {
    background-color: #f3f3f3;
  }
`

export default class extends Component {
  handleClick = () => {
    const { courseSlug, lessonSlug } = this.props.item
    Router.push(
      `/app2?tab=curso&curso=${courseSlug}&lesson=${lessonSlug}`,
      `/app2/curso/${courseSlug}/${lessonSlug}`
    )
    // Se empujan los cambios al App
    // TODO - Con el cambio de arquitectura basado en Query
    // Posiblemente no se requiera
    this.props.onChangeCourse(courseSlug, lessonSlug)
  }

  render () {
    const { size, item, animated, isMobile } = this.props
    return (
      <ItemBox size={size} animated={animated} onClick={this.handleClick}>
        <CoverPanel size={size} isMobile={isMobile}>
          <CoverImg
            // src={getTechIcon(item.tech)}
            src={`https://dxpdcvj89hnue.cloudfront.net/cover/${item.courseSlug}-s100`}
            size={size}
          />
          <TitleBlock>
            <Title size={size}>{item.lessonTitle}</Title>
            <LesonTitle show={size !== 'playing'}>{item.courseTitle}</LesonTitle>
          </TitleBlock>
        </CoverPanel>
      </ItemBox>
    )
  }
}
