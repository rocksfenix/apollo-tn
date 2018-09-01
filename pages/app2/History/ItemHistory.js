import React from 'react'
import styled, {keyframes} from 'styled-components'
import getTechIcon from '../getTechIcon'

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
  flex-direction: ${p => {
    if (p.size === 'playing') return 'column'
    return 'row'
  }};
  padding-left: 1em;

  @media screen and (orientation: landscape) {
    flex-direction: ${p => p.isMobile ? 'row' : ''};
  }

`

const CoverImg = styled.img`
  width: ${p => {
    if (p.size === 'mini' || p.size === 'full') return '20px'
    if (p.size === 'playing') return '100px'
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
  border-bottom: ${p => {
    if (p.size === 'mini' || p.size === 'full') return '1px solid whitesmoke'
    if (p.size === 'playing') return '0'
  }};

  display: flex;
  align-items: center;
  position: relative;
  background-color: #FFF;
  animation: ${p => p.animated ? `.4s ease-out ${Anima}` : ''};
  animation-fill-mode: forwards;
  padding: ${p => {
    if (p.size === 'mini' || p.size === 'full') return '.5em 0'
    if (p.size === 'playing') return '0'
  }};

  @media screen and (orientation: landscape) and (max-width: 900px){
    min-height:  ${p => {
    if (p.size === 'mini') return '100px'
    if (p.size === 'full') return '55px'
    if (p.size === 'playing') return '100px'
  }};
  };

  @media screen and (orientation: portrait) and (max-width: 900px) {
    min-height:  ${p => {
    if (p.size === 'mini') return '100px'
    if (p.size === 'full') return '55px'
    if (p.size === 'playing') return '150px'
  }};
  };
  }

  @media (min-width: 900px){
    min-height:  ${p => {
    if (p.size === 'mini' || p.size === 'full') return '55px'
    if (p.size === 'playing') return '150px'
  }};
  }};
  };

  :hover {
    background-color: #f3f3f3;
  }
`

export default ({ size, item, animated, isMobile }) => (
  <ItemBox size={size} animated={animated}>
    <CoverPanel size={size} isMobile={isMobile}>
      <CoverImg
        src={getTechIcon(item.tech)}
        size={size}
      />
      <TitleBlock>
        <Title size={size}>{item.courseTitle}</Title>
        <LesonTitle show={size !== 'playing'}>{item.title}</LesonTitle>
      </TitleBlock>
    </CoverPanel>
  </ItemBox>
)
