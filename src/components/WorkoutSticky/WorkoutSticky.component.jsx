import React from 'react';
import api from '../../utils/apiCalls';

import './WorkoutSticky.styles.scss';

import { Redirect } from 'react-router-dom';
import Button from '../Button/Button.component';

class WorkoutSticky extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      referrer: null,
    };
  }

  onClick = async () => {
    let { activeProgram, nextWorkout } = this.props;
    let workoutLogId = activeProgram.active_workout_log;

    // Check if next workout is already started (check for active workout log property)
    if (!workoutLogId) {
      // If there's no log, create a new workout log for the current program and make it the active workout log
      let workoutLog = await api.addOne('workout-logs', {
        workout_id: nextWorkout.id,
        program_log_id: activeProgram.id,
        date: new Date(Date.now()),
        created_at: new Date(Date.now()),
      });
      workoutLogId = workoutLog.id;
    }

    // Redirect to the workout log page
    this.setState({
      referrer: `/workout-logs/${workoutLogId}`,
    });
  };

  render() {
    let { activeProgram, nextWorkout, to } = this.props;
    let { referrer } = this.state;

    if (referrer) return <Redirect to={referrer} />;

    return (
      <div className='workout-sticky row'>
        <div className='col-md-8 offset-md-2 col-sm-12 d-flex align-items-center flex-column'>
          <div className='d-flex justify-content-between w-100'>
            <Button text='Skip' position='left' type='secondary' />
            <Button text='Postpone' position='right' type='secondary' />
          </div>
          <small>Today's Workout</small>
          <h2>{nextWorkout.name}</h2>
          <Button text='Workout' position='center' type='primary' onClick={this.onClick} />
        </div>
      </div>
    );
  }
}

export default WorkoutSticky;
