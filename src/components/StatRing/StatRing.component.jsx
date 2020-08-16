import React from 'react';
import './StatRing.styles.scss';

const StatRing = props => {
  let { quantity, unit, stat } = props;
  return (
    <div className='stat-ring'>
      <div className='ring'>
        <div className='quantity'>{quantity}</div>
        <div className='unit'>{unit}</div>
      </div>
      <div className='stat-name'>{stat}</div>
    </div>
  );
};

export default StatRing;
