import types from './currentWorkout.types';

const INITIAL_STATE = null;

const currentWorkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_CURRENT_WORKOUT:
      return {
        ...action.payload,
      };
    case types.CLEAR_CURRENT_WORKOUT:
      return null;
    default:
      return state;
  }
};

export default currentWorkoutReducer;
