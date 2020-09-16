import React from 'react';
import './Header.styles.scss';
import Arrow from '../Arrow/Arrow.component';

const Header = props => {
  let { text, history } = props;

  const goBack = () => {
    history.goBack();
  };

  return (
    <header className='header'>
      <div className='row header align-items-center'>
        <div className='col-lg-8 offset-lg-2 text-left'>
          {history ? (
            <button className='back-button' onClick={goBack}>
              <Arrow direction='left' />
            </button>
          ) : null}
          <h1 className='text-center w-100'>{text}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
