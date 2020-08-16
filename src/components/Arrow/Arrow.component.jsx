import React from 'react';
import './Arrow.styles.scss';

const Arrow = props => {
  let { direction, style, classes } = props;
  if (!style) style = 'dark';

  return (
    <div className={`arrow ${direction} ${style} ${classes ? classes : ''}`}>
      <div className='line-1'></div>
      <div className='line-2'></div>
    </div>
  );
};

export default Arrow;
