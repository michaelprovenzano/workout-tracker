import React from 'react';
import './ExercisePage.styles.scss';

import { connect } from 'react-redux';
import { setActiveExerciseLog } from '../../redux/activeExerciseLog/activeExerciseLog.actions';
import api from '../../utils/apiCalls';

// Components
import Header from '../../components/Header/Header.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import ExerciseForm from '../../components/ExerciseForm/ExerciseForm.component';
import PrevNext from '../../components/PrevNext/PrevNext.component';
import Col from '../Col/Col.component';

class ExercisePage extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      workout: undefined,
      workoutLog: undefined,
      exercises: [],
      activeExercise: 0,
      exerciseLog: undefined,
      lastExerciseLog: undefined,
      formData: {},
    };
  }

  componentDidMount = () => {
    this.setData();
  };

  makeActive = async workoutExerciseId => {
    // Get index
    let activeExerciseIndex = this.state.exercises.findIndex(
      item => item.workout_exercise_id === workoutExerciseId
    );

    // It's janky but the state must be set to null and then re-set to the response for the update to take effect
    this.getExerciseLogData(activeExerciseIndex)
      .then(response => this.setState({ exerciseLog: null }, () => this.setState(response)))
      .then(response => {
        let { exerciseLog, workoutLog } = this.state;

        // Set the url
        if (exerciseLog && workoutLog)
          this.props.history.push(
            `/workout-logs/${workoutLog.workout_log_id}/${exerciseLog.exercise_log_id}`
          );
      })
      .catch(err => console.log(err));
  };

  getLastExerciseLog = async workoutExerciseId => {
    let pastExerciseLogs = await api.get(
      'exercise-logs',
      `workout_exercise_id=${workoutExerciseId}&orderBy=[desc]date`
    );
    if (pastExerciseLogs.length >= 2) return pastExerciseLogs[1];

    return {};
  };

  getExerciseLog = async workoutExerciseId => {
    let { workoutLog } = this.state;

    // Check if there is an exercise log for the next exercise
    let nextExerciseLog = workoutLog.exercise_logs.filter(
      log => log.workout_exercise_id === workoutExerciseId
    );

    // If there is no log, make one
    if (nextExerciseLog.length === 0) {
      // Create a new log
      nextExerciseLog = await api.addOne('exercise-logs', {
        workout_exercise_id: workoutExerciseId,
      });
      workoutLog.exercise_logs.push(nextExerciseLog);
    } else {
      nextExerciseLog = nextExerciseLog[0];
    }

    return nextExerciseLog;
  };

  getExerciseLogData = async nextExerciseIndex => {
    try {
      let { exercises } = this.state;

      // Get the exercise id
      let nextExerciseId = exercises[nextExerciseIndex].workout_exercise_id;

      // Check if there is an exercise log for the next exercise
      let nextExerciseLog = await this.getExerciseLog(nextExerciseId);

      // Get previous exercise log for exercise
      let lastExerciseLog = await this.getLastExerciseLog(nextExerciseId);

      return {
        activeExercise: nextExerciseIndex,
        exerciseLog: nextExerciseLog,
        lastExerciseLog,
      };
    } catch (err) {
      console.log(err);
    }
  };

  getNextPrevExerciseLog = async direction => {
    let { activeExercise, exercises } = this.state;
    let nextExerciseIndex;

    if (direction === 'next') nextExerciseIndex = activeExercise + 1;
    if (direction === 'prev') nextExerciseIndex = activeExercise - 1;

    // Return if the exercise is outside of the array
    if (nextExerciseIndex >= exercises.length || nextExerciseIndex < 0) return;

    this.makeActive(exercises[nextExerciseIndex].workout_exercise_id);
  };

  setData = async () => {
    let { workoutLogId, exerciseLogId } = this.props.match.params;

    // Get all data for exercise page
    let workoutLog = await api.getOne('workout-logs', workoutLogId);
    let workout = await api.getOne('workouts', workoutLog.workout_id);
    let exerciseLog = await api.getOne('exercise-logs', exerciseLogId);
    let lastExerciseLog = await this.getLastExerciseLog(exerciseLog.workout_exercise_id);
    let allExerciseLogs = await api.get('exercise-logs', `workout_log_id=${workoutLogId}`);
    let exercises = await api.get(
      'workout-exercises',
      `workout_id=${workoutLog.workout_id}&orderBy=exercise_order`
    );

    // Append exercise logs to workoutLog
    workoutLog.exercise_logs = allExerciseLogs;

    // Get index of exercise log
    let activeExercise = exercises.findIndex(
      exercise => exercise.workout_exercise_id === exerciseLog.workout_exercise_id
    );

    let formData = {
      total_weight: exerciseLog.total_weight,
      total_reps: exerciseLog.total_reps,
      weight_left: exerciseLog.weight_left,
      weight_right: exerciseLog.weight_right,
      reps_left: exerciseLog.reps_left,
      reps_right: exerciseLog.reps_right,
      notes: exerciseLog.notes,
    };
    this.setState(
      { workout, workoutLog, exerciseLog, lastExerciseLog, activeExercise, exercises, formData },
      () => console.log(this.state)
    );
  };

  updateExerciseLog = log => {
    let { workoutLog } = this.state;

    // Get index of exercise log
    let exerciseLogIndex = workoutLog.exercise_logs.findIndex(
      exerciseLog => exerciseLog.exercise_log_id === log.exercise_log_id
    );

    // Create new workoutlog object
    let newWorkoutLog = { ...workoutLog };

    // Update the exercise log in the workout log object
    newWorkoutLog.exercise_logs[exerciseLogIndex] = log;

    this.setState({ workoutLog: newWorkoutLog }, () => console.log(this.state));
  };

  render() {
    let { activeExercise, workout, workoutLog, exercises, lastExerciseLog } = this.state;
    let { history } = this.props;

    let exerciseName = '',
      workoutName = '',
      programName = '',
      progress = 0;

    if (this.state.exercises.length > 0) {
      activeExercise = this.state.exercises[activeExercise];
      exerciseName = activeExercise.exercise;
    }

    if (workoutLog) progress = (workoutLog.exercise_logs.length / exercises.length) * 100;
    if (workout) {
      workoutName = workout.name;
      programName = workout.program;
    }

    return (
      <div className='exercise-page offset-header'>
        <Header text={`${exerciseName}`} history={history} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgSmall='true' className='workout-list'>
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{workoutName}</div>
                <div className='pb-2'>{programName}</div>
              </div>
              <ProgressBar progress={`${progress}`} />
              <div className='hidden-sm-down'>
                {this.state.exercises.map((exerciseObj, i) => {
                  let { exercise, is_isometric, has_weight, workout_exercise_id } = exerciseObj;
                  let complete;
                  let exerciseLogIndex = workoutLog.exercise_logs.findIndex(
                    exerciseLog => exerciseLog.workout_exercise_id === workout_exercise_id
                  );
                  exerciseLogIndex >= 0 &&
                  !(activeExercise.workout_exercise_id === workout_exercise_id)
                    ? (complete = true)
                    : (complete = false);

                  return (
                    <ExerciseItem
                      name={`${exercise}`}
                      weights={`${has_weight}`}
                      isometric={`${is_isometric}`}
                      key={i}
                      active={activeExercise.workout_exercise_id === workout_exercise_id}
                      complete={complete}
                      onClick={() => this.makeActive(workout_exercise_id)}
                    />
                  );
                })}
              </div>
            </Col>
            <Col number='2' bgLarge='true'>
              <div className='w-100'>
                <h4>Notes from last time:</h4>
                <div className='notes-prev'>{lastExerciseLog ? lastExerciseLog.notes : '-'}</div>
              </div>
              <header className='table-header row w-100'>
                <div className='col-3 offset-6 p-0 d-flex align-items-center'>Previous</div>
                <div className='col-3 p-0 d-flex align-items-center justify-content-center bold'>
                  Current
                </div>
              </header>
              {this.state.exerciseLog ? (
                <ExerciseForm
                  className='w-100'
                  exercise={this.state.exercises[this.state.activeExercise]}
                  exerciseLog={this.state.exerciseLog}
                  previousLog={lastExerciseLog}
                  history={this.props.history}
                  prevNext={this.getNextPrevExerciseLog}
                  updateExerciseLog={this.updateExerciseLog}
                />
              ) : (
                <div>Loading...</div>
              )}

              <PrevNext
                exerciseLog={this.state.exerciseLog}
                formData={this.state.formData}
                history={this.props.history}
                next={() => this.getNextPrevExerciseLog('next')}
                previous={() => this.getNextPrevExerciseLog('prev')}
              />
            </Col>
          </div>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActiveExerciseLog: log => dispatch(setActiveExerciseLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default ExercisePage;
