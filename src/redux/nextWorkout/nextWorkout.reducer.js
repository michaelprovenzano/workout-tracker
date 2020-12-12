const INITIAL_STATE = null;

const nextWorkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_NEXT_WORKOUT':
    case 'GET_NEXT_WORKOUT':
      return action.payload;
    default:
      return state;
  }
};

export default nextWorkoutReducer;
