import React from 'react';
import './ProgressCalendar.styles.scss';

const ProgressCalendar = props => {
  let { calendar } = props;
  if (!calendar) calendar = [];
  return (
    <div className='progress-calendar'>
      <div className='calendar'>
        {calendar.map((item, i) => (
          <div className='calendar-day-container'>
            <div className={`calendar-day ${item.complete ? 'complete' : ''}`}>
              <div className='calendar-day-text text-16'>{i + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCalendar;
