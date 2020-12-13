import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { registerUser } from '../../redux/user/user.actions';
import './SignUpButton.styles.scss';

const SignUpButton = ({
  text,
  position,
  type,
  email,
  password,
  passwordConfirm,
  className,
  user,
  registerUser,
}) => {
  const signUp = (e, email, password, passwordConfirm) => {
    e.preventDefault();
    if (password !== passwordConfirm) return;
    registerUser(email, password, passwordConfirm);
  };

  if (user.token) return <Redirect to='/dashboard' />;

  return (
    <button
      className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
      onClick={e => {
        signUp(e, email, password, passwordConfirm);
      }}
    >
      {text}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { registerUser })(SignUpButton);
