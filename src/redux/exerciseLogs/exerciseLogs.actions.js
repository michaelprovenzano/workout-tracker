import types from './exerciseLogs.types';
import api from '../../utils/apiCalls';

export const addExerciseLog = (workoutLogId, workoutExerciseId) => async dispatch => {
  // Get current exercise logs
  let exerciseLog = await api.addOne('exercise-logs', {
    workout_log_id: workoutLogId,
    workout_exercise_id: workoutExerciseId,
  });

  dispatch({
    type: types.ADD_EXERCISE_LOG,
    payload: exerciseLog,
  });
};

export const getActiveExerciseLog = workout => ({
  type: types.GET_ACTIVE_EXERCISE_LOG,
  payload: workout,
});

// Set array
export const setCurrentExerciseLogs = workoutLogId => async dispatch => {
  // Get current exercise logs
  let exerciseLogs = await api.get('exercise-logs', `workout_log_id=${workoutLogId}`);

  dispatch({
    type: types.SET_CURRENT_EXERCISE_LOGS,
    payload: exerciseLogs,
  });
};

export const clearCurrentExerciseLogs = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_EXERCISE_LOGS,
  });
};

// Set a single log
export const setCurrentExerciseLog = logOrId => async dispatch => {
  let exerciseLog;
  if (typeof logOrId === 'number' || typeof logOrId === 'string')
    exerciseLog = await api.getOne('exercise-logs', logOrId);
  if (typeof logOrId === 'object') exerciseLog = logOrId;

  dispatch({
    type: types.SET_CURRENT_EXERCISE_LOG,
    payload: exerciseLog,
  });
};

// Set a single log
export const setPreviousExerciseLog = currentLog => async dispatch => {
  console.log('The current log is: ' + currentLog);
  if (typeof currentLog !== 'object') return;

  let pastExerciseLogs = await api.get(
    'exercise-logs',
    `workout_exercise_id=${currentLog.workout_exercise_id}&orderBy=[desc]date`
  );

  let exerciseLog;
  if (pastExerciseLogs.length < 2) {
    exerciseLog = null;
  } else if (pastExerciseLogs[0].exercise_log_id === parseInt(currentLog.exercise_log_id)) {
    exerciseLog = pastExerciseLogs[1];
  } else {
    exerciseLog = pastExerciseLogs[0];
  }

  dispatch({
    type: types.SET_PREVIOUS_EXERCISE_LOG,
    payload: exerciseLog,
  });
};

export const updateCurrentExerciseLog = log => async dispatch => {
  let exerciseLog = await api.updateOne('exercise-logs', log.exercise_log_id, log);

  dispatch({
    type: types.UPDATE_CURRENT_EXERCISE_LOG,
    payload: exerciseLog,
  });
};

export const clearCurrentExerciseLog = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_EXERCISE_LOG,
  });
};
