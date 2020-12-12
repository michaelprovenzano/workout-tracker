const INITIAL_STATE = {};

const statsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_STATS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default statsReducer;
