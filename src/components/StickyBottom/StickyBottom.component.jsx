import React from 'react';
import './StickyBottom.styles.scss';

class StickyBottom extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    let { children, className } = this.props;

    return (
      <div className='sticky-bottom row'>
        <div
          className={`col-md-8 offset-md-2 col-sm-12 d-flex align-items-center flex-column ${
            className ? className : ''
          }`}
        >
          {children ? children : null}
        </div>
      </div>
    );
  }
}

export default StickyBottom;
