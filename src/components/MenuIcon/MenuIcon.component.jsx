import React from 'react';
import './MenuIcon.styles.scss';

class MenuIcon extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    let { className, active, onClick } = this.props;

    return (
      <div
        className={`menu-icon ${active ? 'active' : ''} ${className ? className : ''}`}
        onClick={onClick}
      >
        <span className='line-1'></span>
        <span className='line-2'></span>
        <span className='line-3'></span>
      </div>
    );
  }
}

export default MenuIcon;
