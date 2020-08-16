import React from 'react';
import './Header.styles.scss';

const Header = props => {
  let { text } = props;

  return (
    <header className='header'>
      <div className='row header align-items-center'>
        <div className='col-6 offset-3 text-center'>
          <h1>{text}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
