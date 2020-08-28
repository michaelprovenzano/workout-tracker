const INITIAL_STATE = {};

const activeExerciseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_EXERCISE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default activeExerciseReducer;
