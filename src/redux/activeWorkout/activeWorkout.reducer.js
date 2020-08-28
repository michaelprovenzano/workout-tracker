const INITIAL_STATE = {};

const activeWorkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_WORKOUT':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default activeWorkoutReducer;
