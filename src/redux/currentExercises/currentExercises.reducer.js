import types from './currentExercises.types';

const INITIAL_STATE = null;

const currentExercisesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_EXERCISES:
      return action.payload;
    case types.CLEAR_CURRENT_EXERCISES:
      return null;
    default:
      return state;
  }
};

export default currentExercisesReducer;
