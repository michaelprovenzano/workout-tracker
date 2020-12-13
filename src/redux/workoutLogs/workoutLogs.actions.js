import api from '../../utils/apiCalls';
import types from './workoutLogs.types';

export const setWorkoutLogs = programLogId => async dispatch => {
  const data = await api.get('workout-logs', `program_log_id=${programLogId}`);

  dispatch({
    type: types.SET_WORKOUT_LOGS,
    payload: data,
  });
};

export const getActiveWorkoutLog = programLogId => async dispatch => {
  const data = await api.get('workout-logs', `program_log_id=${programLogId}&&active=true`);

  dispatch({
    type: 'GET_ACTIVE_WORKOUT_LOG',
    payload: data[0],
  });
};

export const clearActiveWorkoutLog = () => dispatch => {
  dispatch({
    type: types.CLEAR_ACTIVE_WORKOUT_LOG,
  });
};

export const addWorkoutLog = log => async dispatch => {
  let newLog = await api.addOne('workout-logs', log);

  dispatch({
    type: types.ADD_WORKOUT_LOG,
    payload: newLog,
  });
};

export const updateWorkoutLog = (id, log) => async dispatch => {
  let newLog = await api.updateOne('workout-logs', id, log);

  dispatch({
    type: types.UPDATE_WORKOUT_LOG,
    payload: newLog,
  });
};

export const setCurrentWorkoutLog = logOrId => async dispatch => {
  let workoutLog;
  if (typeof logOrId === 'number' || typeof logOrId === 'string')
    workoutLog = await api.getOne('workout-logs', logOrId);

  if (typeof logOrId === 'object') workoutLog = logOrId;

  dispatch({
    type: types.SET_CURRENT_WORKOUT_LOG,
    payload: workoutLog,
  });
};

export const clearCurrentWorkoutLog = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUT_LOG,
  });
};

export const skipWorkoutLog = workoutLogId => async dispatch => {
  await api.updateOne('workout-logs', workoutLogId, { active: false, skipped: true });

  dispatch({
    type: types.SKIP_WORKOUT_LOG,
    payload: workoutLogId,
  });
};

export const resetWorkoutLogs = () => dispatch =>
  dispatch({
    type: types.RESET_WORKOUT_LOGS,
  });
