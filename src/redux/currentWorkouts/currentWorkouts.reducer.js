import types from './currentWorkouts.types';

const INITIAL_STATE = null;

const currentWorkoutsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_WORKOUTS:
      return action.payload;
    case types.CLEAR_CURRENT_WORKOUTS:
      return null;
    default:
      return state;
  }
};

export default currentWorkoutsReducer;
