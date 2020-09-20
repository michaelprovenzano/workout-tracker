import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import { setJwtCookie } from '../../utils/cookieController';
import './SignInButton.styles.scss';

class SignInButton extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  signIn = (email, password) => {
    fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      // Set the global user below
      .then(data => {
        if (data.status === 'success') {
          // Put the token in a cookie
          setJwtCookie(data.token);

          // Restrict the data put into state
          let userData = {
            id: data.id,
            email: data.email,
          };

          // Add the user to the state
          this.props.setCurrentUser(userData);

          this.props.history.push('/dashboard');
        } else {
          console.log(data);
        }
      })
      .catch(err => console.log(err.data));
  };

  render() {
    let { text, position, type, email, password, className } = this.props;
    return (
      <button
        className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
        onClick={e => {
          this.signIn(email, password);
        }}
      >
        {text}
      </button>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(withRouter(SignInButton));
