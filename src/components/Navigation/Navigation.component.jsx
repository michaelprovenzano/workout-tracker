import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Navigation.styles.scss';
import LogOutButton from '../LogOutButton/LogOutButton.component';
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
    let isExpanded = this.state.expanded;
    this.setState({ expanded: !isExpanded });
  };

  collapseMenu = e => {
    this.setState({ expanded: false });
  };

  render() {
    let show = '';
    let currentUser = this.props.user;
    let expanded = this.state.expanded;
    let isLoggedIn;
    currentUser.user_id ? (isLoggedIn = true) : (isLoggedIn = false);

    if (this.state.expanded) show = 'show';

    return (
      <div className='navbar'>
        <Link to='/'>
          <img src={logo} alt='trackbody logo' />
        </Link>
        <div className='nav-toggle-btn' onClick={this.menuClick}>
          <MenuIcon active={expanded} />
        </div>
        <nav className={show}>
          <div className='nav-toggle-header'>
            <h2 className='nav-toggle-text'>Menu</h2>
          </div>
          {isLoggedIn ? (
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
              {/* <li>
                <NavLink to='/settings' onClick={this.collapseMenu}>
                  Settings
                </NavLink>
              </li> */}
              <li className='pin-to-bottom'>
                <LogOutButton
                  position='center'
                  type='primary'
                  text={isLoggedIn ? 'Log Out' : 'Sign In'}
                />
              </li>
            </ul>
          ) : (
            <ul>
              <li className='pin-to-bottom'>
                <LogOutButton
                  position='center'
                  type='primary'
                  text={isLoggedIn ? 'Log Out' : 'Sign In'}
                />
              </li>
            </ul>
          )}
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(Navigation);
