import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setCurrentUser } from '../../redux/user/user.actions';
import './SignInButton.styles.scss';

const SignInButton = ({
  text,
  position,
  type,
  email,
  password,
  className,
  user,
  setCurrentUser,
}) => {
  const signIn = (e, email, password) => {
    e.preventDefault();
    setCurrentUser(email, password);
  };

  if (user.token) return <Redirect to={'/dashboard'} />;

  return (
    <button
      className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
      onClick={e => {
        signIn(e, email, password);
      }}
    >
      {text}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, { setCurrentUser })(SignInButton);
