import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const LinkElement = styled.a`
  display: inline-block;
  text-decoration: none;
  line-height: 4;
  font-size: 27px;
  color: #FFF;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 300px;

  &:hover {
    opacity: .8;
  }
`

const getGradient = (gradient, disabled) => {
  const gradients = {
    error: 'linear-gradient(to right, rgb(255, 91, 91) 0%, rgb(215, 48, 48) 100%)',
    success: 'linear-gradient(to right, rgb(162, 219, 0) 0%, #7ca23e 100%)',
    warn: 'linear-gradient(to right, rgb(241, 196, 34) 0%, rgb(215, 152, 48) 100%)',
    info: 'linear-gradient(to right, rgb(0, 115, 219) 0%, #00b6ff 100%)',
    purple: 'linear-gradient(to right, rgb(48, 60, 162) 0%, rgb(133, 92, 232) 100%)',
    ocean: 'linear-gradient(to right, #00b6ff 0%, #521454 100%)',
    afternoon: 'linear-gradient(to right, #ff6200 0%, #521454 100%)',
    pro: 'linear-gradient(to right,#262d67 0%,#50a3e3 100%)',
    disabled: 'linear-gradient(to right, #dad8d7 0%, #a0a0a0 100%)'
  }
  if (disabled) return gradients['disabled']

  return gradients[gradient]
}

const getRound = (shape) => {
  const shapes = {
    round: '1em',
    semiRound: '.2em',
    square: '.1em'
  }
  return shapes[shape]
}

const LinkButton = ({ gradient, shape, disabled, href, children }) => {
  const styles = {
    background: getGradient(gradient, disabled),
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: getRound(shape)
  }

  return (
    <Link href={href} passHref>
      <LinkElement style={styles}>{ children }</LinkElement>
    </Link>
  )
}

LinkButton.defaultProps = {
  shape: 'scuare',
  gradient: 'purple'
}

LinkButton.propTypes = {
  // Define la forma si es cuadrada o redonda
  shape: PropTypes.string,

  // Define el tipo de gradiente
  gradient: PropTypes.string,

  // Indica si el link esta desabilitado
  disabled: PropTypes.bool,

  // Es el href del link usado por Link de Next.js
  href: PropTypes.string

}

export default LinkButton
