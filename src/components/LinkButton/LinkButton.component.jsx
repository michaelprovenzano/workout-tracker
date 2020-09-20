import React from 'react';
import './LinkButton.styles.scss';

import Link from 'react-router-dom';

class Button extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    let { text, position, type, className, to } = this.props;

    return (
      <Link to={to} className={`btn btn-${type} btn-${position} ${className ? className : ''}`}>
        {text}
      </Link>
    );
  }
}

export default Button;
