import React from 'react';
import './Col.styles.scss';

const Col = props => {
  let { children, number, bg, bgLarge, bgSmall, className } = props;

  return (
    <section
      className={`col-component col-lg-4 col-md-6 ${
        number === '1' ? 'offset-lg-2' : ''
      } d-flex justify-content-start align-items-center flex-column ${bgLarge ? 'bg-lg' : ''} ${
        bgSmall ? 'bg-sm' : ''
      } ${bg ? 'bg' : ''} ${className}`}
    >
      {children}
    </section>
  );
};

export default Col;
