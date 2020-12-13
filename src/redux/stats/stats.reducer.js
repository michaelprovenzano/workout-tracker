import types from './stats.types';

const INITIAL_STATE = {};

const statsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_STATS':
      return {
        ...state,
        ...action.payload,
      };
    case types.CLEAR_STATS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default statsReducer;
