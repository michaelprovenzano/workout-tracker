import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { removeCurrentUser } from '../../redux/user/user.actions';
import { removeJwtCookie } from '../../utils/cookieController';
import './LogOutButton.styles.scss';

class LogOutButton extends React.Component {
  constructor(props) {
    super();
  }

  logOut = () => {
    // Remove the token from cookie
    removeJwtCookie();

    // Add the user to the state
    this.props.removeCurrentUser();

    // Redirect
    this.props.history.push('/sign-in');

    // Change button text
    this.setState({ text: 'Sign In' });
  };

  render() {
    let { position, type, className, text, collapseMenu } = this.props;

    return (
      <button
        className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
        onClick={() => {
          this.logOut();
          collapseMenu();
        }}
      >
        {text}
      </button>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  removeCurrentUser: user => dispatch(removeCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(withRouter(LogOutButton));
