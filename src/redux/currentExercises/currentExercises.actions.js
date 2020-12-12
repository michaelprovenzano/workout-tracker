import types from './currentExercises.types';
import api from '../../utils/apiCalls';

export const setCurrentExercises = workoutId => async dispatch => {
  //   // Set in redux
  //   // this.props.setActiveWorkoutLog(workout);

  //   // Create hash table of ids
  //   let exerciseLogIds = {};
  //   exerciseLogs.forEach(item => (exerciseLogIds[item.exercise_id] = item.exercise_id));

  // Get the exercises for the current workout
  let exercises = await api.get(
    'workout-exercises',
    `workout_id=${workoutId}&orderBy=exercise_order`
  );

  dispatch({
    type: types.SET_CURRENT_EXERCISES,
    payload: exercises,
  });
};

export const clearCurrentExercises = () => ({
  type: types.CLEAR_CURRENT_EXERCISES,
});
