import React from 'react';
import './Button.styles.scss';

class Button extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      history: null,
      targetUrl: null,
    };
  }

  render() {
    let { text, position, type, className, history, targetUrl, onClick } = this.props;

    return (
      <button
        className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
        onClick={() => {
          if (targetUrl && history) history.push(targetUrl);
          if (onClick) onClick();
        }}
      >
        {text}
      </button>
    );
  }
}

export default Button;
