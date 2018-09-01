import React from 'react'
import styled from 'styled-components'

const MainPanel = styled.div`
  height: 100vh;
  /* background-color: red; */
  position: fixed;
  top: 0;
  z-index: 500;
`

export default ({ children, width }) => {
  const styles = { width }
  return <MainPanel style={styles}> { children } </MainPanel>
}
