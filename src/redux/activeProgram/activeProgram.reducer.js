const INITIAL_STATE = {};

const activeProgramReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_PROGRAM':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default activeProgramReducer;
