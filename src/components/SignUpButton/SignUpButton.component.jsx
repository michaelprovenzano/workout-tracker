import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import './SignUpButton.styles.scss';

class SignUpButton extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  signUp = (email, password, passwordConfirm) => {
    if (password !== passwordConfirm) return;

    fetch('http://localhost:8000/api/user', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      // Set the global user token below
      .then(data => this.props.setCurrentUser(data))
      .then(() => {
        this.props.history.push('/dashboard');
      })
      .catch(err => console.log(err));
  };

  render() {
    let { text, position, type, email, password, passwordConfirm, className } = this.props;
    return (
      <button
        className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
        onClick={e => {
          this.signUp(email, password, passwordConfirm);
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

export default connect(null, mapDispatchToProps)(withRouter(SignUpButton));
