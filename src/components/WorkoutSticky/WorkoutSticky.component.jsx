import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './WorkoutSticky.styles.scss';

// Redux
import { connect } from 'react-redux';
import {
  skipWorkoutLog,
  addWorkoutLog,
  clearCurrentWorkoutLog,
  clearActiveWorkoutLog,
} from '../../redux/workoutLogs/workoutLogs.actions';
import { getNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';
import { clearCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { clearCurrentWorkout } from '../../redux/currentWorkout/currentWorkout.actions';

// Components
import Button from '../Button/Button.component';

const WorkoutSticky = ({
  activeProgramLog,
  activeWorkoutLog,
  nextWorkout,
  getNextWorkout,
  skipWorkoutLog,
  addWorkoutLog,
  clearCurrentWorkout,
  clearCurrentWorkoutLog,
  clearCurrentExercises,
  clearActiveWorkoutLog,
}) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (activeWorkoutLog && redirect) {
      history.push(`/workout-logs/${activeWorkoutLog.workout_log_id}`);
    }
    // eslint-disable-next-line
  }, [activeProgramLog, activeWorkoutLog, nextWorkout]);

  const skipWorkout = () => {
    if (activeWorkoutLog) {
      skipWorkoutLog(activeWorkoutLog.workout_log_id);
      clearActiveWorkoutLog();
    } else {
      addWorkoutLog({
        program_log_id: activeProgramLog.program_log_id,
        program_workout_id: nextWorkout.program_workout_id,
        date: new Date(Date.now()),
        skipped: true,
        active: false,
      });
    }

    getNextWorkout(activeProgramLog);
  };

  const goToWorkoutLog = () => {
    clearCurrentWorkoutLog();
    clearCurrentExercises();
    clearCurrentWorkout();

    if (!activeWorkoutLog) {
      // If there's no log, create a new workout log for the current program and make it the active workout log
      addWorkoutLog({
        program_workout_id: nextWorkout.program_workout_id,
        program_log_id: activeProgramLog.program_log_id,
        date: new Date(Date.now()),
        skipped: false,
        active: true,
      });
      setRedirect(true);
    } else {
      history.push(`/workout-logs/${activeWorkoutLog.workout_log_id}`);
    }

    // Get the stats to check and update program progress
    // if (stats.progress === 1)
    //   await api.updateOne('program-logs', activeWorkoutLog, { status: 'completed' });
  };

  return (
    (nextWorkout || activeWorkoutLog) && (
      <div className='workout-sticky row'>
        <div className='col-md-8 offset-md-2 col-sm-12 d-flex align-items-center flex-column'>
          <div className='d-flex w-100'>
            <Button
              className='skip-button'
              text='Skip'
              position='left'
              type='secondary'
              onClick={skipWorkout}
            />
          </div>
          {activeWorkoutLog ? <small>Today's Workout</small> : <small>Next Workout</small>}
          <h2>{activeWorkoutLog ? activeWorkoutLog.name : nextWorkout.name}</h2>
          <Button
            text={activeWorkoutLog ? 'Continue Workout' : 'Start Workout'}
            position='center'
            type='primary'
            onClick={goToWorkoutLog}
          />
        </div>
      </div>
    )
  );
};

const mapStateToProps = state => ({
  activeProgramLog: state.programLogs.activeProgramLog,
  activeWorkoutLog: state.workoutLogs.activeWorkoutLog,
  workoutLogs: state.workoutLogs.workoutLogs,
  nextWorkout: state.nextWorkout,
  stats: state.stats,
});

const mapDispatchToProps = {
  skipWorkoutLog,
  addWorkoutLog,
  getNextWorkout,
  clearActiveWorkoutLog,
  clearCurrentWorkout,
  clearCurrentWorkoutLog,
  clearCurrentExercises,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSticky);
