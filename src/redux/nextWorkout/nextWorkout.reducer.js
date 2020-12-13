import types from './nextWorkout.types';

const INITIAL_STATE = null;

const nextWorkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_NEXT_WORKOUT':
    case 'GET_NEXT_WORKOUT':
      return action.payload;
    case types.RESET_NEXT_WORKOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default nextWorkoutReducer;
