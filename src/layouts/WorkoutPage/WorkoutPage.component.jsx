import React from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
import { setActiveProgram } from '../../redux/activeProgram/activeProgram.actions';
import { setActiveWorkoutLog } from '../../redux/activeWorkoutLog/activeWorkoutLog.actions';
import { setActiveExerciseLog } from '../../redux/activeExerciseLog/activeExerciseLog.actions';
import { setActiveWorkout } from '../../redux/activeWorkout/activeWorkout.actions';
import api from '../../utils/apiCalls';

import Header from '../../components/Header/Header.component';
import Button from '../../components/Button/Button.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';

import Col from '../Col/Col.component';

class WorkoutPage extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      workoutLog: undefined,
      workout: undefined,
      exercises: [],
      exerciseLogs: [],
      exerciseLogIds: [],
    };
  }

  componentDidMount = async () => {
    let { workoutLogId } = this.props.match.params;

    let workoutLog = await api.getOne('workout-logs', workoutLogId);
    let activeProgramLog = await api.getOne('program-logs', workoutLog.program_log_id);

    // Get the workout and set it in redux
    let workout = await api.get(
      'program-workouts',
      `program_workout_id=${workoutLog.program_workout_id}`
    );
    workout = workout[0];
    // this.props.setActiveWorkout(workout);

    // Get current exercise logs
    let exerciseLogs = await api.get('exercise-logs', `workout_log_id=${workoutLogId}`);
    workoutLog.exercise_logs = exerciseLogs;

    // Set in redux
    // this.props.setActiveWorkoutLog(workoutLog);

    // Create hash table of ids
    let exerciseLogIds = {};
    exerciseLogs.forEach(item => (exerciseLogIds[item.exercise_id] = item.exercise_id));

    // Get the exercises for the current workout
    let exercises = await api.get(
      'workout-exercises',
      `workout_id=${workoutLog.workout_id}&orderBy=exercise_order`
    );

    this.setState(
      {
        activeProgramLog,
        workoutLog,
        workout,
        exercises,
        exerciseLogs,
        exerciseLogIds,
      },
      () => console.log(this.state)
    );
  };

  goToExerciseLog = async (logId, workoutExerciseId) => {
    let { history } = this.props;
    let { workoutLog } = this.state;
    let workoutLogId;

    if (workoutLog) workoutLogId = workoutLog.workout_log_id;
    if (logId) {
      history.push(`/workout-logs/${workoutLogId}/${logId}`);
    } else {
      console.log({ workoutLogId, workoutExerciseId });
      let exerciseLog = await api.addOne('exercise-logs', {
        workout_log_id: workoutLogId,
        workout_exercise_id: workoutExerciseId,
      });
      history.push(`/workout-logs/${workoutLogId}/${exerciseLog.exercise_log_id}`);
    }
  };

  onClick = async e => {
    let { history } = this.props;
    let { exercises, exerciseLogs, workoutLog } = this.state;
    let workoutLogId = workoutLog.workout_log_id;

    if (exercises.length === 0) {
      // If workout has no exercises complete current workout
      if (workoutLog.active) {
        let response = await api.updateOne('workout-logs', workoutLogId, {
          active: false,
          progress: 1,
        });
        if (response) history.push(`/dashboard`);
      } else {
        await api.updateOne('workout-logs', workoutLogId, { progress: 1 });
      }
    } else if (exerciseLogs.length === 0) {
      // If workout has no logs, create one and go to it
      let response = await api.addOne('exercise-logs', {
        workout_log_id: workoutLogId,
        workout_exercise_id: exercises[0].workout_exercise_id,
      });
      if (response)
        history.push(`/workout-logs/${workoutLog.workout_log_id}/${response.exercise_log_id}`);
    } else {
      // If workout has exercises, go to last completed exercise log
      history.push(
        `/workout-logs/${workoutLog.workout_log_id}/${
          exerciseLogs[exerciseLogs.length - 1].exercise_log_id
        }`
      );
    }
  };

  resetProgress = async () => {
    let { workoutLog } = this.state;

    let newWorkoutLog = await api.updateOne('workout-logs', workoutLog.workout_log_id, {
      progress: 0,
    });
    this.setState({ workoutLog: newWorkoutLog });
  };

  resetSkip = async () => {
    let { workoutLog } = this.state;

    let newWorkoutLog = await api.updateOne('workout-logs', workoutLog.workout_log_id, {
      skipped: false,
    });
    this.setState({ workoutLog: newWorkoutLog });
  };

  skipWorkout = async () => {
    let { history } = this.props;
    let { workoutLogId } = this.props.match.params;
    await api
      .updateOne('workout-logs', workoutLogId, { active: false, skipped: true })
      .then(response => console.log(response))
      .then(() => history.push('/dashboard'));
  };

  render() {
    const { history } = this.props;
    let { workout, exercises, exerciseLogs, workoutLog, activeProgramLog } = this.state;

    if (!workoutLog || !workout) return <div>Loading...</div>;
    console.log(workoutLog);

    let name = '';
    if (workout) name = workout.name;

    let buttonText = 'Mark Complete';
    if (exerciseLogs.length > 0) buttonText = 'Continue';
    if (exercises.length > 0) buttonText = 'Start';

    // Hash workout logs
    let exerciseLogHash = {};
    if (exerciseLogs) {
      exerciseLogs.forEach((exerciseLog, i) => {
        exerciseLogHash[exerciseLog.workout_exercise_id] = {
          index: i,
          ...exerciseLog,
        };
      });
    }

    return (
      <div className='workout-page offset-header'>
        <Header text={`${name}`} history={history} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgSmall='true'>
              <div className='d-flex justify-content-start mb-20px w-100'>
                {!workoutLog.skipped ? (
                  <Button
                    text='Skip'
                    type='secondary'
                    position='left'
                    className='w-50'
                    onClick={this.skipWorkout}
                  />
                ) : (
                  <Button
                    text='Undo Skip'
                    type='danger'
                    position='center'
                    className='w-100 mb-20px'
                    onClick={this.resetSkip}
                  />
                )}
              </div>
              {workoutLog.progress === 1 ? (
                <Button
                  text='Reset Workout Progress'
                  type='danger'
                  position='center'
                  className='w-100 mb-20px'
                  onClick={this.resetProgress}
                />
              ) : null}
              {!workoutLog.skipped && workoutLog.progress !== 1 ? (
                <Button
                  text={buttonText}
                  type='primary'
                  position='center'
                  className='w-100 mb-20px'
                  onClick={this.onClick}
                />
              ) : null}
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{name}</div>
                <div className='pb-2'>{activeProgramLog ? activeProgramLog.name : 'null'}</div>
              </div>
              {workoutLog ? <ProgressBar progress={workoutLog.progress * 100} /> : null}
            </Col>
            {exercises.length > 0 ? (
              <Col number='2' bgLarge='true'>
                {exercises.map((exerciseObj, i) => {
                  let logId;

                  let { exercise, is_isometric, has_weight, workout_exercise_id } = exerciseObj;
                  let hasLog = exerciseLogHash[exerciseObj.workout_exercise_id];
                  if (hasLog) logId = hasLog.exercise_log_id;

                  return (
                    <ExerciseItem
                      name={`${exercise}`}
                      weights={`${has_weight}`}
                      isometric={`${is_isometric}`}
                      key={i}
                      onClick={() => this.goToExerciseLog(logId, workout_exercise_id)}
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
  }
}

const mapDispatchToProps = dispatch => ({
  // setActiveWorkout: workout => dispatch(setActiveWorkout(workout)),
  setActiveProgram: program => dispatch(setActiveProgram(program)),
  // setActiveWorkoutLog: log => dispatch(setActiveWorkoutLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default WorkoutPage;
