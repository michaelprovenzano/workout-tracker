const INITIAL_STATE = {};

const nextWorkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_NEXT_WORKOUT':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default nextWorkoutReducer;
