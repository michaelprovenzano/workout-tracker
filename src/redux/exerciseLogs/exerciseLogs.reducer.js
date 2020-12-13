import types from './exerciseLogs.types';

const INITIAL_STATE = {
  activeExerciseLog: null,
  previousExerciseLog: null,
  currentExerciseLogs: null,
  currentExerciseLog: null,
};

const exerciseLogsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_EXERCISE_LOG:
      return {
        ...state,
        currentExerciseLog: action.payload,
        currentExerciseLogs: [...state.currentExerciseLogs, action.payload],
      };
    case types.GET_ACTIVE_EXERCISE_LOG:
      return {
        ...state,
        activeExerciseLog: action.payload,
      };
    case types.SET_CURRENT_EXERCISE_LOGS:
      return {
        ...state,
        currentExerciseLogs: action.payload,
      };
    case types.SET_CURRENT_EXERCISE_LOG:
      return {
        ...state,
        currentExerciseLog: action.payload,
      };
    case types.SET_PREVIOUS_EXERCISE_LOG:
      return {
        ...state,
        previousExerciseLog: action.payload,
      };
    case types.UPDATE_CURRENT_EXERCISE_LOG:
      return {
        ...state,
        currentExerciseLog: action.payload,
        currentExerciseLogs: state.currentExerciseLogs.map(log =>
          log.exercise_log_id === action.payload.exercise_log_id ? action.payload : log
        ),
      };
    case types.CLEAR_CURRENT_EXERCISE_LOG:
      return {
        ...state,
        currentExerciseLog: null,
      };
    case types.CLEAR_CURRENT_EXERCISE_LOGS:
      return {
        ...state,
        currentExerciseLogs: null,
      };
    case types.RESET_EXERCISE_LOGS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default exerciseLogsReducer;
