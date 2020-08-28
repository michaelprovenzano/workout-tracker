import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import activeProgramReducer from './activeProgram/activeProgram.reducer';
import nextWorkoutReducer from './nextWorkout/nextWorkout.reducer';
import activeWorkoutReducer from './activeWorkout/activeWorkout.reducer';
import activeWorkoutLogRecuder from './activeWorkoutLog/activeWorkoutLog.reducer';
import activeExerciseLogReducer from './activeExerciseLog/activeExerciseLog.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'activeProgram',
    'activeWorkout',
    'activeWorkoutLog',
    'activeExerciseLog',
    'nextWorkout',
  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  activeProgram: activeProgramReducer,
  activeWorkout: activeWorkoutReducer,
  activeWorkoutLog: activeWorkoutLogRecuder,
  activeExerciseLog: activeExerciseLogReducer,
  nextWorkout: nextWorkoutReducer,
});

export default persistReducer(persistConfig, rootReducer);
