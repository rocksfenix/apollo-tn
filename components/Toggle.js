import React, { Component } from 'react'

var hasOwn = {}.hasOwnProperty

function classNames () {
  var classes = []

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    if (!arg) continue

    var argType = typeof arg

    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      classes.push(classNames.apply(null, arg))
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}

export default class Toggle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      toggle: false
    }
    this.toggleState = this.toggleState.bind(this)
    this.insideStyles = this.insideStyles.bind(this)
    this.toggleStyles = this.toggleStyles.bind(this)
  }

  componentWillMount = () => {
    this.setState({ toggle: this.props.defaultChecked })
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.defaultChecked !== this.props.defaultChecked) {
      this.setState({ toggle: nextProps.defaultChecked })
    }
  }

  toggleState () {
    this.setState({
      toggle: !this.state.toggle
    })
    this.props.onChange(!this.state.toggle)
  }

  insideStyles () {
    return ({
      background: this.state.toggle ? typeof this.props.activeColor !== 'undefined' ? this.props.activeColor : '' : typeof this.props.deactiveColor !== 'undefined' ? this.props.deactiveColor : ''
    })
  }

  toggleStyles () {
    if (!typeof this.props.borderMatch !== 'undefined' && this.props.borderMatch) {
      return ({
        border: this.state.toggle ? typeof this.props.activeColor !== 'undefined' ? 'solid 1px ' + this.props.activeColor : '' : typeof this.props.deactiveColor !== 'undefined' ? 'solid 1px ' + this.props.deactiveColor : ''
      })
    }
  }

  render () {
    return (
      <div className='toggleHolder'>
        <div className='toggleWrapper' onClick={this.toggleState}>
          <div className={classNames('toggle', {active: this.state.toggle}, {deactive: !this.state.toggle})} style={this.toggleStyles()}>
            <div className='inside' style={this.insideStyles()} />
          </div>
        </div>
      </div>
    )
  }
}
