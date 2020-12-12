import types from './currentWorkout.types';
import api from '../../utils/apiCalls';

export const setCurrentWorkout = programWorkoutId => async dispatch => {
  let workout = await api.get('program-workouts', `program_workout_id=${programWorkoutId}`);

  dispatch({
    type: types.SET_CURRENT_WORKOUT,
    payload: workout[0],
  });
};

export const clearCurrentWorkout = () => async dispatch => {
  dispatch({
    type: types.CLEAR_CURRENT_WORKOUT,
  });
};
