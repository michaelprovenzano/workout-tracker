const INITIAL_STATE = {};

const activeWorkoutLogReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_WORKOUT_LOG':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default activeWorkoutLogReducer;
