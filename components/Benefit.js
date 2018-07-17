import React from 'react'
import styled from 'styled-components'
import Title from './Title'

const Panel = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  flex-direction: ${props => props.direction === 'right' ? 'row-reverse' : 'row'};

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

const TextBox = styled.div`
  width: 60%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-width: 900px) {
    width: 100%;
  }
`
const Description = styled.div`
  width: 100%;
  font-size: 19px;
  color: #353f4f;
  font-weight: 300;
  text-align: ${props => props.textAlign === 'right' ? 'left' : 'right'};

  @media (max-width: 1024px) {
    font-size: 17px;
  }

  @media (max-width: 900px) {
    text-align: left;
    font-size: 18px;
  }
`

const ImageBox = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0 0 0;

  @media (max-width: 900px) {
    width: 100%;
  }
`

const Image = styled.img`
  width: 80%;
  @media (max-width: 900px) {
    width: 90%;
  }
`

const BenefitComponent = ({ direction, title, description, imageSrc, alt }) => {
  const textAlign = direction === 'right' ? 'left' : 'right'
  if (direction === 'left') {
    return (
      <Panel direction={direction}>
        <TextBox >
          <Title as='h4' size='33px' textAlign={textAlign}>{ title }</Title>
          <Description direction={direction}>{ description }</Description>
        </TextBox>
        <ImageBox>
          <Image src={imageSrc} alt={alt} />
        </ImageBox>
      </Panel>
    )
  }

  return (
    <Panel direction={direction}>
      <TextBox >
        <Title as='h4' size='33px' textAlign={textAlign}>{ title }</Title>
        <Description direction={direction}>{ description }</Description>
      </TextBox>
      <ImageBox>
        <Image src={imageSrc} alt={alt} />
      </ImageBox>
    </Panel>
  )
}

export default BenefitComponent
