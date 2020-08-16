import React from 'react';
import './PrevNext.styles.scss';

import Arrow from '../Arrow/Arrow.component';

const PrevNext = props => {
  let { classes } = props;

  return (
    <div className={`prev-next w-100 d-flex align-items-center row ${classes}`}>
      <div className='col-6 col-lg-4 offset-lg-2 h-100'>
        <button className='prev h-100 w-100 m-0 d-flex justify-content-start align-items-center'>
          <Arrow direction='left' />
          <span className='btn-text'>Prev</span>
        </button>
      </div>
      <div className='col-6 col-lg-4 h-100'>
        <button className='prev h-100 w-100 m-0 d-flex justify-content-end align-items-center'>
          <span className='btn-text'>Next</span>
          <Arrow direction='right' />
        </button>
      </div>
    </div>
  );
};

export default PrevNext;
