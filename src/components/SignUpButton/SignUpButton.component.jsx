import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import { setJwtCookie } from '../../utils/cookieController';
import api from '../../utils/apiCalls';
import './SignUpButton.styles.scss';

class SignUpButton extends React.Component {
  constructor(props) {
    super();

    this.state = {};
  }

  signUp = (e, email, password, passwordConfirm) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;

    api
      .post('register', {
        email: email,
        password: password,
      })
      // Set the global user token below
      .then(data => {
        setJwtCookie(data.token);
        data.token = null;
        this.props.setCurrentUser(data);
      })
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
          this.signUp(e, email, password, passwordConfirm);
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
