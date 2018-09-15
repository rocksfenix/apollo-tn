import React from 'react'
import ReactDOM from 'react-dom'
import styled, {keyframes} from 'styled-components'

// Let's create a Modal component that is an abstraction around
// the portal API.
class Modal extends React.Component {
  constructor (props) {
    super(props)
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.

    if (process.browser) {
      this.el = document.createElement('div')
      this.modalRoot = document.getElementById('modal-root')
    }
  }

  componentDidMount () {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    if (process.browser) {
      this.modalRoot.appendChild(this.el)
    }
  }

  componentWillUnmount () {
    // Remove the element from the DOM when we unmount
    if (process.browser) {
      this.modalRoot.removeChild(this.el)
    }
  }

  render () {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    )
  }
}

const Anima = keyframes`
  0% {
    opacity: 0;
    transform: scale(.99);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const Panel = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.87);
  display: ${p => p.show ? 'flex' : 'none'};
  animation: ${Anima} .4s ease-out;
  will-change: transform, opacity;

  @media (max-width: 900px) {
    transform: ${p => p.show ? 'translateY(0%)' : 'notranslateY(100%)'};
  }
`

const PanelComp = ({ show, children }) => (
  <Modal>
    <Panel show={show}>
      { children }
    </Panel>
  </Modal>
)

export default PanelComp
