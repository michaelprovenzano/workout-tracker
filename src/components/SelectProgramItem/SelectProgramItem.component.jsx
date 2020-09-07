import React from 'react';
import './SelectProgramItem.styles.scss';

import '../../utils/apiCalls';

class SelectProgramItem extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    let { program, company, active, programLength, id, className, onClick } = this.props;

    return (
      <button
        className={`program-item outline-none d-flex align-items-center ${active ? 'active' : ''} ${
          className ? className : ''
        }`}
        id={id}
        onClick={onClick}
      >
        <div className='cb d-flex justify-content-center align-items-center'>
          <div className='checkmark'></div>
        </div>
        <div className='d-flex flex-column justify-content-center align-items-start'>
          <div className='text-16 bold mb-1'>{program}</div>
          <div className='text-12 bold mb-1'>{company ? company : ''}</div>
          <div className='text-12'>{programLength ? `${programLength} days` : ''}</div>
        </div>
      </button>
    );
  }
}

export default SelectProgramItem;
