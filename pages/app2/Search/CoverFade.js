import React from 'react'
import styled from 'styled-components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const CoverImg = styled.img`
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  will-change: transform, opacity;
`

const Panel = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`
export default ({ courseSlug, src }) => (
  <Panel>
    <TransitionGroup>
      <CSSTransition
        timeout={2000} key={courseSlug}
        classNames='searchCover'
      >
        <CoverImg src={src} />
      </CSSTransition>
    </TransitionGroup>
  </Panel>
)
