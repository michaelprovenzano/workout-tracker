import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Navigation.styles.scss';
import Button from '../Button/Button.component';
import logo from '../../images/trackbody-logo.svg';
import MenuIcon from '../../components/MenuIcon/MenuIcon.component';

class Navigation extends React.Component {
  constructor(props) {
    super();

    this.state = {
      expanded: false,
    };
  }

  menuClick = e => {
    e.preventDefault();
    let isExpanded = this.state.expanded;
    this.setState({ expanded: !isExpanded });
  };

  collapseMenu = e => {
    this.setState({ expanded: false });
  };

  render() {
    let show = '';
    let { currentUser } = this.props.user;
    if (this.state.expanded) show = 'show';

    return (
      <div className='navbar'>
        <Link to='/'>
          <img src={logo} alt='trackbody logo' />
        </Link>
        <div className='nav-toggle-btn' onClick={this.menuClick}>
          <MenuIcon />
        </div>
        <nav className={show}>
          <div className='nav-toggle-header'>
            <h2 className='nav-toggle-text'>Menu</h2>
          </div>
          <ul>
            <li>
              <NavLink to='/dashboard' onClick={this.collapseMenu}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to='/my-programs' onClick={this.collapseMenu}>
                My Programs
              </NavLink>
            </li>
            <li>
              <NavLink to='/settings' onClick={this.collapseMenu}>
                Settings
              </NavLink>
            </li>
            <li className='pin-to-bottom'>
              {currentUser ? (
                <Button
                  text='Log Out'
                  position='center'
                  type='primary'
                  onClick={this.collapseMenu}
                />
              ) : null}
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(Navigation);
