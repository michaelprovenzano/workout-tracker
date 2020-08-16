import React from 'react';
import './ExerciseItem.styles.scss';

import '../../utils/apiCalls';

import Arrow from '../Arrow/Arrow.component';
import { ReactComponent as Weights } from '../../images/Weights.svg';
import { ReactComponent as Isometric } from '../../images/Isometric.svg';

class ExerciseItem extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    let { name, complete, active, weights, isometric, classes, onClick } = this.props;

    return (
      <button
        className={`exercise-item outline-none ${active ? 'active' : ''} ${
          complete ? 'complete' : ''
        } ${classes ? classes : ''}`}
        onClick={onClick}
      >
        <div className='d-flex justify-content-between'>
          <div className='d-flex justify-content-start align-items-center'>
            <div className='cb'>{complete ? <div className='checkmark'></div> : null}</div>
            <div className='name'>{name}</div>
          </div>
          <div className='d-flex justify-content-end align-items-center'>
            <div className='detail'>{weights === 'true' ? <Weights /> : null}</div>
            <div className='detail'>{isometric === 'true' ? <Isometric /> : null}</div>
            <Arrow direction='right' />
          </div>
        </div>
      </button>
    );
  }
}

export default ExerciseItem;
