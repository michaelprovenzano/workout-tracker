import React, { useEffect, useState } from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { setCurrentWorkout } from '../../redux/currentWorkout/currentWorkout.actions';
import {
  setCurrentWorkoutLog,
  clearCurrentWorkoutLog,
  updateWorkoutLog,
} from '../../redux/workoutLogs/workoutLogs.actions';
import {
  addExerciseLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
} from '../../redux/exerciseLogs/exerciseLogs.actions';
import { getNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';

import Header from '../../components/Header/Header.component';
import Button from '../../components/Button/Button.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import DateInput from '../../components/DateInput/DateInput.component';

import Col from '../../components/Col/Col.component';

const WorkoutPage = ({
  activeProgramLog,
  updateWorkoutLog,
  currentWorkoutLog,
  currentWorkout,
  currentExercises,
  currentExerciseLogs,
  currentExerciseLog,
  addExerciseLog,
  setCurrentWorkout,
  setCurrentWorkoutLog,
  setCurrentExercises,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  match,
  history,
}) => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const workoutLogId = match.params.workoutLogId;
    if (!currentWorkoutLog) setCurrentWorkoutLog(workoutLogId);
    if (!currentExerciseLogs) setCurrentExerciseLogs(workoutLogId);
    if (currentWorkoutLog && !currentWorkout)
      setCurrentWorkout(currentWorkoutLog.program_workout_id);
    if (currentWorkoutLog && currentWorkout) {
      if (currentWorkoutLog.program_workout_id !== currentWorkout.program_workout_id)
        setCurrentWorkout(currentWorkoutLog.program_workout_id);
    }
    if (currentWorkout && !currentExercises) setCurrentExercises(currentWorkout.workout_id);
    if (currentExerciseLog && redirect)
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );
    console.log(currentWorkoutLog);
    // eslint-disable-next-line
  }, [
    currentWorkoutLog,
    currentWorkout,
    currentExercises,
    currentExerciseLogs,
    currentExerciseLog,
  ]);

  const goToExerciseLog = async (exerciseLogId, workoutExerciseId) => {
    let workoutLogId;
    if (currentWorkoutLog) workoutLogId = currentWorkoutLog.workout_log_id;

    if (currentWorkoutLog && !exerciseLogId) addExerciseLog(workoutLogId, workoutExerciseId);
    if (currentWorkoutLog && exerciseLogId) setCurrentExerciseLog(exerciseLogId);

    setRedirect(true);
  };

  const onClick = () => {
    // If workout has no exercises complete current workout
    if (currentExercises.length === 0) {
      updateWorkoutLog(currentWorkoutLog.workout_log_id, { active: false, progress: 1 });
      getNextWorkout();
      history.push(`/dashboard`);
    } else if (currentExerciseLogs.length === 0) {
      // If workout has no exercise logs, create one and go to it
      addExerciseLog(currentWorkoutLog.workout_log_id, currentExercises[0].workout_exercise_id);
      setRedirect(true);
    } else {
      // If workout has exercises, go to last completed exercise log
      history.push(
        `/workout-logs/${currentWorkoutLog.workout_log_id}/${currentExerciseLog.exercise_log_id}`
      );
    }
  };

  const resetProgress = () => updateWorkoutLog(currentWorkoutLog.workout_log_id, { progress: 0 });

  const resetSkip = () => updateWorkoutLog(currentWorkoutLog.workout_log_id, { skipped: false });

  const skipWorkout = () => {
    updateWorkoutLog(currentWorkoutLog.workout_log_id, { active: false, skipped: true });
    history.push('/dashboard');
  };

  if (!currentWorkoutLog || !currentWorkout || !currentExercises || !currentExerciseLogs)
    return <div>Loading...</div>;

  let buttonText = 'Mark Complete';
  if (currentExerciseLogs.length > 0) buttonText = 'Continue';
  if (currentExercises.length > 0) buttonText = 'Start';

  let workoutName = '';
  if (currentWorkout) workoutName = currentWorkout.name;

  // // Hash workout logs
  let exerciseLogHash = {};
  if (currentExerciseLogs) {
    currentExerciseLogs.forEach((exerciseLog, i) => {
      exerciseLogHash[exerciseLog.workout_exercise_id] = {
        index: i,
        ...exerciseLog,
      };
    });
  }

  return (
    <div className='workout-page offset-header'>
      <Header text={`${workoutName}`} history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgSmall='true'>
            <div className='d-flex justify-content-start mb-20px w-100'>
              {!currentWorkoutLog.skipped ? (
                <Button
                  text='Skip'
                  type='secondary'
                  position='left'
                  className='w-50'
                  onClick={skipWorkout}
                />
              ) : (
                <Button
                  text='Undo Skip'
                  type='danger'
                  position='center'
                  className='w-100 mb-20px'
                  onClick={resetSkip}
                />
              )}
            </div>
            {currentWorkoutLog.progress === 1 ? (
              <Button
                text='Reset Workout Progress'
                type='danger'
                position='center'
                className='w-100 mb-20px'
                onClick={resetProgress}
              />
            ) : null}
            {!currentWorkoutLog.skipped && currentWorkoutLog.progress !== 1 ? (
              <Button
                text={buttonText}
                type='primary'
                position='center'
                className='w-100 mb-20px'
                onClick={onClick}
              />
            ) : null}
            <div className='workout-program d-flex justify-content-between w-100'>
              <div className='pb-2'>{workoutName}</div>
              <div className='pb-2'>{activeProgramLog ? activeProgramLog.name : 'null'}</div>
            </div>
            {currentWorkoutLog ? <ProgressBar progress={currentWorkoutLog.progress * 100} /> : null}
            <DateInput
              initialDate={currentWorkoutLog.date}
              onInput={date => updateWorkoutLog(currentWorkoutLog.workout_log_id, { date: date })}
            />
          </Col>
          {currentExercises.length > 0 ? (
            <Col number='2' bgLarge='true'>
              {currentExercises.map((exerciseObj, i) => {
                let { exercise, is_isometric, has_weight, workout_exercise_id } = exerciseObj;
                let hasLog = exerciseLogHash[exerciseObj.workout_exercise_id];

                let logId;
                if (hasLog) logId = hasLog.exercise_log_id;

                return (
                  <ExerciseItem
                    name={`${exercise}`}
                    weights={`${has_weight}`}
                    isometric={`${is_isometric}`}
                    key={i}
                    onClick={() => goToExerciseLog(logId, workout_exercise_id)}
                    complete={hasLog}
                  />
                );
              })}
            </Col>
          ) : (
            <Col number='2' bgLarge='true'>
              <p className='text-primary'>
                Nothing specific to track here! Just sweat it out and when you're finished mark it
                complete!
              </p>
            </Col>
          )}
        </div>
      </main>
    </div>
  );
};

const mapDispatchToProps = {
  addExerciseLog,
  updateWorkoutLog,
  setCurrentExercises,
  setCurrentWorkout,
  setCurrentWorkoutLog,
  setCurrentExerciseLogs,
  setCurrentExerciseLog,
  clearCurrentExerciseLog,
  clearCurrentWorkoutLog,
};

const mapStateToProps = state => ({
  activeProgramLog: state.programLogs.activeProgramLog,
  currentExercises: state.currentExercises,
  currentExerciseLogs: state.exerciseLogs.currentExerciseLogs,
  currentExerciseLog: state.exerciseLogs.currentExerciseLog,
  currentWorkout: state.currentWorkout,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
