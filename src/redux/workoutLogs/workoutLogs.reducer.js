import types from './workoutLogs.types';

const INITIAL_STATE = {
  activeWorkoutLog: null,
  currentWorkoutLog: null,
  workoutLogs: null,
};

const workoutLogsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_WORKOUT_LOG:
    case types.UPDATE_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: action.payload.skipped || !action.payload.active ? null : action.payload,
        currentWorkoutLog: action.payload,
        workoutLogs: [...state.workoutLogs, action.payload],
      };
    case types.SET_WORKOUT_LOGS:
      return {
        ...state,
        workoutLogs: action.payload,
      };
    case types.GET_ACTIVE_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: action.payload,
      };
    case types.CLEAR_ACTIVE_WORKOUT_LOG:
      return {
        ...state,
        activeWorkoutLog: null,
      };
    case types.SKIP_WORKOUT_LOG:
      if (state.workoutLogs)
        return {
          ...state,
          workoutLogs: {
            activeWorkoutLog: null,
            workoutLogs: state.workoutLogs.map(log =>
              log.workout_log_id !== action.payload ? log : action.payload
            ),
          },
        };
      break;
    case types.SET_CURRENT_WORKOUT_LOG:
      return {
        ...state,
        currentWorkoutLog: action.payload,
      };
    case types.CLEAR_CURRENT_WORKOUT_LOG:
      return {
        ...state,
        currentWorkoutLog: null,
      };
    default:
      return state;
  }
};

export default workoutLogsReducer;
