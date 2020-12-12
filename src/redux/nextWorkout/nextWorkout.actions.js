import api from '../../utils/apiCalls';

export const setNextWorkout = nextWorkout => dispatch =>
  dispatch({
    type: 'SET_NEXT_WORKOUT',
    payload: nextWorkout,
  });

export const getNextWorkout = programLog => async dispatch => {
  let nextWorkout;

  // let workouts = await api.get('program-workouts', `program_id=1654`);
  let workouts = await api.get(
    'program-workouts',
    `program_id=${programLog.program_id}&orderBy=workout_order`
  );

  let workoutLogs = await api.get(
    'workout-logs',
    `program_log_id=${programLog.program_log_id}&orderBy=workout_order`
  );

  // If starting a new program, set the first workout
  if (workoutLogs.length === 0) {
    nextWorkout = workouts[0];
  } else {
    // Else get the next workout to be done
    for (let i = workouts.length - 1; i >= 0; i--) {
      let thisWorkout = workouts[i];
      if (thisWorkout.workout_order === workoutLogs[workoutLogs.length - 1].workout_order) {
        nextWorkout = workouts[i + 1];
      }
    }
  }

  dispatch({
    type: 'GET_NEXT_WORKOUT',
    payload: nextWorkout,
  });
};
