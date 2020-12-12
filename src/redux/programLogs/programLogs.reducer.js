import types from './programLogs.types';

const INITIAL_STATE = {
  activeProgramLog: null,
  currentProgramLog: null,
  programLogs: null,
};

const activeProgramLogReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_ACTIVE_PROGRAM_LOG':
      let log = null;
      if (action.payload) log = action.payload;
      return {
        ...state,
        activeProgramLog: log,
      };
    case types.SET_CURRENT_PROGRAM_LOG:
      return {
        ...state,
        currentProgramLog: action.payload,
      };
    case types.SET_PROGRAM_LOGS:
      return { ...state, programLogs: action.payload };
    default:
      return state;
  }
};

export default activeProgramLogReducer;
