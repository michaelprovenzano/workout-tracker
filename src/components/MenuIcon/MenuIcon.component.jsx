import React from 'react';
import './MenuIcon.styles.scss';

class MenuIcon extends React.Component {
  constructor(props) {
    super();
    this.state = { active: false };
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  };

  render() {
    let { classes } = this.props;
    return (
      <div
        className={`menu-icon ${this.state.active ? 'active' : ''} ${classes ? classes : ''}`}
        onClick={this.toggleActive}
      >
        <span className='line-1'></span>
        <span className='line-2'></span>
        <span className='line-3'></span>
      </div>
    );
  }
}

export default MenuIcon;
