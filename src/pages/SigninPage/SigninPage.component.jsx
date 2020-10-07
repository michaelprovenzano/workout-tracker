import React from 'react';
import { Link } from 'react-router-dom';
import './SigninPage.styles.scss';

import InputText from '../../components/InputText/InputText.component';
import Button from '../../components/Button/Button.component';
import SignInButton from '../../components/SignInButton/SignInButton.component';
import logo from '../../images/logo-signin.svg';

class SigninPage extends React.Component {
  constructor(props) {
    super();

    this.state = {
      email: '',
      password: '',
    };
  }

  setField = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  render() {
    return (
      <div className='signup-page offset-header'>
        <main className=''>
          <div className='row'>
            <div className='col-sm-6 offset-sm-3 col-lg-4 offset-lg-4 d-flex flex-column align-items-center'>
              <div className='logo d-flex justify-content-center flex-column'>
                <img src={logo} alt='logo' />
              </div>
              <InputText
                name='email'
                type='text'
                label='Email'
                className='w-100'
                onInput={e => this.setField(e, 'email')}
              />
              <InputText
                name='password'
                type='password'
                label='Password'
                className='w-100'
                onInput={e => this.setField(e, 'password')}
              />
              <SignInButton
                text='Sign In'
                type='primary'
                className='w-100 sign-in'
                email={this.state.email}
                password={this.state.password}
              />

              <Link to='/forgot-password' className='password-link'>
                Forgot your password?
              </Link>
              <p>Don't have an account?</p>
              <Link to='/sign-up' className='btn btn-primary btn-center w-100'>
                Sign Up
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default SigninPage;
