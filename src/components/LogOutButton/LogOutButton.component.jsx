import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { removeCurrentUser } from '../../redux/user/user.actions';
import { resetProgramLogs } from '../../redux/programLogs/programLogs.actions';
import { resetWorkoutLogs } from '../../redux/workoutLogs/workoutLogs.actions';
import { resetExerciseLogs } from '../../redux/exerciseLogs/exerciseLogs.actions';
import { clearCurrentWorkout } from '../../redux/currentWorkout/currentWorkout.actions';
import { clearCurrentWorkouts } from '../../redux/currentWorkouts/currentWorkouts.actions';
import { clearCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { resetNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';
import { clearStats } from '../../redux/stats/stats.actions';

import './LogOutButton.styles.scss';

const LogOutButton = ({
  position,
  type,
  className,
  collapseMenu,
  user,
  removeCurrentUser,
  resetProgramLogs,
  resetWorkoutLogs,
  resetExerciseLogs,
  clearCurrentWorkout,
  clearCurrentWorkouts,
  clearCurrentExercises,
  resetNextWorkout,
  clearStats,
}) => {
  const logOut = () => {
    // Reset all of the state
    removeCurrentUser();
    resetProgramLogs();
    resetWorkoutLogs();
    resetExerciseLogs();
    clearCurrentWorkout();
    clearCurrentWorkouts();
    clearCurrentExercises();
    resetNextWorkout();
    clearStats();

    // Redirect
    return <Redirect to='/sign-in' />;
  };

  return (
    <button
      className={`btn btn-${type} btn-${position} ${className ? className : ''}`}
      onClick={() => {
        logOut();
        collapseMenu();
      }}
    >
      {user.token ? 'Log Out' : 'Sign In'}
    </button>
  );
};

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = {
  removeCurrentUser,
  resetProgramLogs,
  resetWorkoutLogs,
  resetExerciseLogs,
  clearCurrentWorkout,
  clearCurrentWorkouts,
  clearCurrentExercises,
  resetNextWorkout,
  clearStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogOutButton);
