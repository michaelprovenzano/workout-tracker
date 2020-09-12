import React from 'react';
import api from '../../utils/apiCalls';

// Redux Store
import { connect } from 'react-redux';
import { setActiveWorkoutLog } from '../../redux/activeWorkoutLog/activeWorkoutLog.actions';

import './WorkoutSticky.styles.scss';

import Button from '../Button/Button.component';

class WorkoutSticky extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      redirect: undefined,
    };
  }

  onClick = async () => {
    let { activeProgramLog, nextWorkout, history } = this.props;
    let workoutLogId = activeProgramLog.active_workout_log;

    // Check if next workout is already started (check for active workout log property)
    if (!workoutLogId) {
      // If there's no log, create a new workout log for the current program and make it the active workout log
      let workoutLog = await api.addOne('workout-logs', {
        program_workout_id: nextWorkout.program_workout_id,
        program_log_id: activeProgramLog.program_log_id,
      });

      if (workoutLog) workoutLogId = workoutLog.workout_log_id;
    }

    // Redirect to the workout log page
    if (workoutLogId) history.push(`/workout-logs/${workoutLogId}`);
  };

  render() {
    let { nextWorkout, activeWorkout, skip, postpone } = this.props;
    let buttonText;

    activeWorkout ? (buttonText = 'Continue Workout') : (buttonText = 'Start Workout');

    return (
      <div className='workout-sticky row'>
        <div className='col-md-8 offset-md-2 col-sm-12 d-flex align-items-center flex-column'>
          <div className='d-flex w-100'>
            <Button
              className='skip-button'
              text='Skip'
              position='left'
              type='secondary'
              onClick={skip}
            />
          </div>
          {activeWorkout ? <small>Today's Workout</small> : <small>Next Workout</small>}
          <h2>{activeWorkout ? activeWorkout.name : nextWorkout.name}</h2>
          <Button text={buttonText} position='center' type='primary' onClick={this.onClick} />
        </div>
      </div>
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   // setActiveWorkout: workout => dispatch(setActiveWorkout(workout)),
//   // setActiveProgram: program => dispatch(setActiveProgram(program)),
//   setActiveWorkoutLog: log => dispatch(setActiveWorkoutLog(log)),
// });

// const mapStateToProps = state => ({
//   ...state,
// });

export default WorkoutSticky;
