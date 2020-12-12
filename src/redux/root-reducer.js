import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import programLogsReducer from './programLogs/programLogs.reducer';
import currentExercisesReducer from './currentExercises/currentExercises.reducer';
import nextWorkoutReducer from './nextWorkout/nextWorkout.reducer';
import currentWorkoutReducer from './currentWorkout/currentWorkout.reducer';
import currentWorkoutsReducer from './currentWorkouts/currentWorkouts.reducer';
import workoutLogsReducer from './workoutLogs/workoutLogs.reducer';
import exerciseLogsReducer from './exerciseLogs/exerciseLogs.reducer';
import statsReducer from './stats/stats.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'programLogs',
    'workoutLogs',
    'exerciseLogs',
    'currentWorkout',
    'nextWorkout',
    'currentWorkouts',
    'currentExercises',
    'stats',
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  programLogs: programLogsReducer,
  workoutLogs: workoutLogsReducer,
  exerciseLogs: exerciseLogsReducer,
  currentWorkout: currentWorkoutReducer,
  currentWorkouts: currentWorkoutsReducer,
  currentExercises: currentExercisesReducer,
  nextWorkout: nextWorkoutReducer,
  stats: statsReducer,
});

export default persistReducer(persistConfig, rootReducer);
