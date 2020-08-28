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
      saveFormData: false,
      updateForm: false,
      referrer: null,
    };
  }

  componentDidMount = () => {
    this.setData();
  };

  makeActive = async id => {
    let nextExerciseId = id;

    // Get index
    let activeExerciseIndex = this.state.exercises.findIndex(item => item.id === id);

    // Check if there is an exercise log for the next exercise
    let nextExerciseLog = await this.getExerciseLog(nextExerciseId);

    // Get previous exercise log for exercise
    let lastExerciseLog = await this.getLastExerciseLog(nextExerciseId);

    this.setState(
      {
        activeExercise: activeExerciseIndex,
        exerciseLog: undefined,
      },
      () => {
        this.props.history.push(`/workout-logs/${this.state.workoutLog.id}/${nextExerciseLog.id}`);

        this.setState({
          activeExercise: activeExerciseIndex,
          exerciseLog: nextExerciseLog,
          lastExerciseLog,
        });
      }
    );
  };

  getLastExerciseLog = async exerciseId => {
    let pastExerciseLogs = await api.get(
      'exercise-logs',
      `exercise_id=${exerciseId}&orderBy=[desc]date`
    );
    if (pastExerciseLogs.length >= 2) return pastExerciseLogs[1];

    return {};
  };

  getExerciseLog = async exerciseId => {
    let { workoutLog } = this.state;

    // Check if there is an exercise log for the next exercise
    let nextExerciseLog = workoutLog.exercise_logs.filter(log => log.exercise_id === exerciseId);

    // If there is no log, make one
    if (nextExerciseLog.length === 0) {
      // Create a new log
      nextExerciseLog = await api.addOne('exercise-logs', { exercise_id: exerciseId });
      workoutLog.exercise_logs.push(nextExerciseLog);
    } else {
      nextExerciseLog = nextExerciseLog[0];
    }

    return nextExerciseLog;
  };

  getNextPrevExerciseLog = async direction => {
    let { workoutLog, activeExercise, exercises } = this.state,
      nextExerciseIndex;

    if (direction === 'next') nextExerciseIndex = activeExercise + 1;
    if (direction === 'prev') nextExerciseIndex = activeExercise - 1;

    // Get the exercise id
    let nextExerciseId = exercises[nextExerciseIndex].id;

    // Return if the exercise is outside of the array
    if (nextExerciseIndex >= exercises.length - 1 || nextExerciseIndex < 0) return;

    // Check if there is an exercise log for the next exercise
    let nextExerciseLog = await this.getExerciseLog(nextExerciseId);

    // Get previous exercise log for exercise
    let lastExerciseLog = await this.getLastExerciseLog(nextExerciseId);

    this.setState(
      {
        exerciseLog: undefined,
      },
      () =>
        this.setState(
          {
            activeExercise: nextExerciseIndex,
            exerciseLog: nextExerciseLog,
            lastExerciseLog,
          },
          () => console.log(this.state)
        )
    );

    // Redirect
    this.props.history.push(`/workout-logs/${workoutLog.id}/${nextExerciseLog.id}`);
  };

  setData = async () => {
    let { workoutLogId, exerciseLogId } = this.props.match.params;

    // Get all data for exercise page
    let exercises = [];
    let workoutLog = await api.getOne('workout-logs', workoutLogId);
    let workout = await api.getOne('workouts', workoutLog.workout_id);
    let exerciseLog = await api.getOne('exercise-logs', exerciseLogId);
    let lastExerciseLog = await this.getLastExerciseLog(exerciseLog.exercise_id);
    let allExerciseLogs = await api.get('exercise-logs', `workout_log_id=${workoutLogId}`);

    // Append exercise logs to workoutLog
    workoutLog.exercise_logs = allExerciseLogs;

    // Populate exercises
    for (let i = 0; i < workout.exercises.length; i++) {
      let exerciseData = await api.getOne('exercises', workout.exercises[i]);
      exerciseData.key = i;
      exercises.push(exerciseData);
    }

    // Get index of exercise log
    let activeExercise = exercises.findIndex(log => log.id === exerciseLog.exercise_id);

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
      exerciseLog => exerciseLog.id === log.id
    );

    // Create new workoutlog object
    let newWorkoutLog = { ...workoutLog };

    // Update the exercise log in the workout log object
    newWorkoutLog.exercise_logs[exerciseLogIndex] = log;

    this.setState({ workoutLog: newWorkoutLog }, () => console.log(this.state));
  };

  render() {
    let { activeExercise, workoutLog, lastExerciseLog } = this.state;

    let exerciseName = '',
      workoutName = '';

    if (this.state.exercises.length > 0) {
      activeExercise = this.state.exercises[activeExercise];
      exerciseName = activeExercise.exercise;
    }

    return (
      <div className='workout-page offset-header'>
        <Header text={`${exerciseName}`} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgSmall='true' className='workout-list'>
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{workoutName}</div>
                <div className='pb-2'>P90X3</div>
              </div>
              <ProgressBar progress='25' />
              <div className='hidden-sm-down'>
                {this.state.exercises.map((exerciseObj, i) => {
                  let { exercise, is_isometric, has_weight, id } = exerciseObj;
                  let complete;
                  let exerciseLogIndex = workoutLog.exercise_logs.findIndex(
                    exerciseLog => exerciseLog.exercise_id === id
                  );
                  exerciseLogIndex >= 0 && !(activeExercise.id === id)
                    ? (complete = true)
                    : (complete = false);
                  return (
                    <ExerciseItem
                      name={`${exercise}`}
                      weights={`${has_weight}`}
                      isometric={`${is_isometric}`}
                      key={i}
                      active={activeExercise.id === id}
                      complete={complete}
                      onClick={() => this.makeActive(id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExercisePage);
