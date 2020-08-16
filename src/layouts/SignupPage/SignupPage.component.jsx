import React from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.styles.scss';

import InputText from '../../components/InputText/InputText.component';
import Button from '../../components/Button/Button.component';
import SignUpButton from '../../components/SignUpButton/SignUpButton.component';
import logo from '../../images/logo-signin.svg';

class SignupPage extends React.Component {
  constructor(props) {
    super();

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
    };
  }

  setField = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  render() {
    let { email, password, passwordConfirm } = this.state;
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
              <InputText
                name='password-confirm'
                type='password'
                label='Confirm Password'
                className='w-100'
                onInput={e => this.setField(e, 'passwordConfirm')}
              />
              <SignUpButton
                text='Sign Up'
                type='primary'
                className='w-100 sign-in'
                email={email}
                password={password}
                passwordConfirm={passwordConfirm}
              />

              <Link to='/forgot-password' className='password-link'>
                Forgot your password?
              </Link>
              <p>Don't have an account?</p>
              <Button
                text='Sign In'
                type='primary'
                className='w-100 sign-up'
                email={this.state.email}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default SignupPage;
