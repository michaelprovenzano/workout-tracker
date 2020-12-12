import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './ExercisePage.styles.scss';

// Redux
import { connect } from 'react-redux';
import { setCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { setCurrentWorkout } from '../../redux/currentWorkout/currentWorkout.actions';
import { setCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import {
  addExerciseLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  setPreviousExerciseLog,
} from '../../redux/exerciseLogs/exerciseLogs.actions';

// Components
import Header from '../../components/Header/Header.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import ExerciseForm from '../../components/ExerciseForm/ExerciseForm.component';
import PrevNext from '../../components/PrevNext/PrevNext.component';
import Col from '../../components/Col/Col.component';

const ExercisePage = ({
  currentWorkout,
  currentWorkoutLog,
  addExerciseLog,
  currentExerciseLog,
  currentExerciseLogs,
  previousExerciseLog,
  currentExercises,
  setCurrentWorkout,
  setCurrentWorkoutLog,
  setCurrentExercises,
  setCurrentExerciseLog,
  setCurrentExerciseLogs,
  setPreviousExerciseLog,
  match,
}) => {
  let [redirect, setRedirect] = useState(false);
  let history = useHistory();

  useEffect(() => {
    const workoutLogId = match.params.workoutLogId;
    const exerciseLogId = match.params.exerciseLogId;

    if (!currentWorkoutLog) setCurrentWorkoutLog(workoutLogId);
    if (!currentExerciseLogs) setCurrentExerciseLogs(workoutLogId);
    if (currentWorkoutLog && !previousExerciseLog) setPreviousExerciseLog(workoutLogId);
    if (currentWorkoutLog && !currentWorkout)
      setCurrentWorkout(currentWorkoutLog.program_workout_id);
    if (currentWorkout && !currentExercises) setCurrentExercises(currentWorkout.workout_id);
    if (!currentExerciseLog) setCurrentExerciseLog(exerciseLogId);
    if (!previousExerciseLog && currentExerciseLog) setPreviousExerciseLog(currentExerciseLog);
    if (redirect)
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );
    // eslint-disable-next-line
  }, [
    currentWorkout,
    currentWorkoutLog,
    currentExercises,
    currentExerciseLog,
    currentExerciseLogs,
  ]);

  const makeActive = workoutExerciseId => {
    let newActiveLog = currentExerciseLogs.find(
      log => log.workout_exercise_id === workoutExerciseId
    );

    if (newActiveLog) {
      setCurrentExerciseLog(newActiveLog.exercise_log_id);
    } else {
      addExerciseLog(currentWorkoutLog.workout_log_id, workoutExerciseId);
    }

    setRedirect(true);
  };

  if (
    !currentExercises ||
    !currentExerciseLogs ||
    !currentExerciseLog ||
    !currentWorkout ||
    !currentWorkoutLog
  )
    return <div>Loading...</div>;

  let progress = (currentExerciseLogs.length / currentExercises.length) * 100;
  let currentExercise = currentExercises.find(
    log => log.workout_exercise_id === currentExerciseLog.workout_exercise_id
  );

  return (
    <div className='exercise-page offset-header'>
      <Header
        text={`${currentExercise ? currentExercise.exercise || '' : 'Exercise'}`}
        history={history}
      />
      <main className=''>
        <div className='row'>
          <Col number='1' bgSmall='true' className='workout-list'>
            <div className='workout-program d-flex justify-content-between w-100'>
              <div className='pb-2'>{currentWorkout.name}</div>
              <div className='pb-2'>{currentWorkout.program}</div>
            </div>
            <ProgressBar progress={`${progress}`} />
            <div className='hidden-sm-down'>
              {currentExercises.map((exerciseObj, i) => {
                let { exercise, is_isometric, has_weight, workout_exercise_id } = exerciseObj;

                let exerciseLogIndex = currentExerciseLogs.findIndex(
                  exerciseLog => exerciseLog.workout_exercise_id === workout_exercise_id
                );

                let complete;
                exerciseLogIndex >= 0 &&
                !(currentExerciseLog.workout_exercise_id === workout_exercise_id)
                  ? (complete = true)
                  : (complete = false);

                return (
                  <ExerciseItem
                    name={`${exercise}`}
                    weights={`${has_weight}`}
                    isometric={`${is_isometric}`}
                    key={i}
                    active={currentExerciseLog.workout_exercise_id === workout_exercise_id}
                    complete={complete}
                    onClick={() => makeActive(workout_exercise_id)}
                  />
                );
              })}
            </div>
          </Col>
          <Col number='2' bgLarge='true'>
            <div className='w-100'>
              <h4>Notes from last time:</h4>
              <div className='notes-prev'>
                {previousExerciseLog ? previousExerciseLog.notes : '-'}
              </div>
            </div>
            <header className='table-header row w-100'>
              <div className='col-3 offset-6 p-0 d-flex align-items-center'>Previous</div>
              <div className='col-3 p-0 d-flex align-items-center justify-content-center bold'>
                Current
              </div>
            </header>
            {currentExerciseLog ? (
              <ExerciseForm
                className='w-100'
                exercise={currentExercise || {}}
                currentLog={currentExerciseLog || {}}
                previousLog={previousExerciseLog || {}}
                history={history}
              />
            ) : (
              <div>Loading...</div>
            )}

            <PrevNext />
          </Col>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
  currentExerciseLog: state.exerciseLogs.currentExerciseLog,
  currentExerciseLogs: state.exerciseLogs.currentExerciseLogs,
  previousExerciseLog: state.exerciseLogs.previousExerciseLog,
});

const mapDispatchToProps = {
  setCurrentWorkoutLog,
  setCurrentWorkout,
  addExerciseLog,
  setCurrentExercises,
  setCurrentExerciseLog,
  setCurrentExerciseLogs,
  setPreviousExerciseLog,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExercisePage);
