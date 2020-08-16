import React from 'react';
import './Button.styles.scss';
import { Redirect } from 'react-router-dom';

class Button extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      referrer: null,
    };
  }

  render() {
    let { text, position, type, className, to, onClick } = this.props;
    let { referrer } = this.state;

    if (referrer) return <Redirect to={referrer} />;

    return (
      <button
        className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
        onClick={() => {
          if (to) this.setState({ referrer: to });
          if (onClick) onClick();
        }}
      >
        {text}
      </button>
    );
  }
}

export default Button;
