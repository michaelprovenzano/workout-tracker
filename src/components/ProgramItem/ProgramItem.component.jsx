import React from 'react';
import moment from 'moment';
import './ProgramItem.styles.scss';

import '../../utils/apiCalls';

import Arrow from '../Arrow/Arrow.component';

class ProgramItem extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  onClick = e => {
    const { url, history } = this.props;
    if (url) history.push(url);
  };

  render() {
    let {
      name,
      completed,
      skipped,
      abandoned,
      abandonedAfter,
      date,
      dateRange,
      program,
      workout,
      classes,
      onClick,
      id,
    } = this.props;
    let day;
    let days = '90';

    if (date) {
      let newDate = moment(date);
      date = newDate.format('MM/DD/YYYY');
      day = newDate.format('dddd');
    }

    return (
      <button
        id={id}
        className={`program-item outline-none ${abandoned ? 'abandoned' : ''} ${
          completed ? 'completed' : ''
        } ${skipped ? 'skipped' : ''} ${classes ? classes : ''}`}
        onClick={onClick ? onClick : this.onClick}
      >
        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column justify-content-center align-items-start'>
            <div className='name mb-2'>{name}</div>
            <div className='date-range mb-2'>
              <span className='bold'>{day ? `${day} | ` : ''}</span>
              {dateRange ? dateRange : ''}
              {date ? date : ''}
            </div>
            <div className='d-flex align-items-center status'>
              <div className='status-icon'>
                {completed ? <div className='checkmark'></div> : null}
              </div>
              <span
                className={`pl-2 ${completed ? 'text-primary' : ''} ${
                  abandoned ? 'text-danger' : ''
                }`}
              >
                {completed && program ? `Completed in ${days} days` : ''}
                {abandoned && program ? `Abandoned after ${abandonedAfter} days` : ''}
                {!completed && !abandoned && program ? 'In progress' : ''}
                {completed && workout ? `Completed` : ''}
                {skipped && workout ? `Skipped` : ''}
                {!completed && !skipped && workout ? 'Incomplete' : ''}
              </span>
            </div>
          </div>
          <div className='d-flex justify-content-end align-items-center'>
            <Arrow direction='right' />
          </div>
        </div>
      </button>
    );
  }
}

export default ProgramItem;
