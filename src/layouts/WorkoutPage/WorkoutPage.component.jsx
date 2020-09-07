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
      workout: undefined,
      exercises: [],
      exerciseLogs: [],
      exerciseLogIds: [],
    };
  }

  componentDidMount = async () => {
    let { workoutLogId } = this.props.match.params;

    let workoutLog = await api.getOne('workout-logs', workoutLogId);

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
    let workoutLogId = workoutLog.workout_log_id;
    if (logId) {
      history.push(`/workout-logs/${workoutLogId}/${logId}`);
    } else {
      let exerciseLog = await api.addOne('exercise-logs', {
        workout_exercise_id: workoutExerciseId,
      });
      history.push(`/workout-logs/${workoutLogId}/${exerciseLog.exercise_log_id}`);
    }
  };

  onClick = async () => {
    let { history } = this.props;
    let response = await api.patchReq('util/complete-active-workout');
    if (response.status === 'success') history.push(`/dashboard`);
  };

  render() {
    const { activeWorkoutLog, activeProgram } = this.props;
    let { workout, exercises, exerciseLogs } = this.state;

    if (!activeWorkoutLog && activeProgram && workout) return <div>Loading...</div>;

    let name = '';
    if (workout) name = workout.name;

    let buttonText = 'Start';
    let onClick;
    if (activeProgram.active_workout_log) buttonText = 'Continue';
    if (exercises.length === 0) {
      buttonText = 'Complete';
      onClick = this.onClick;
    }

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
    console.log(exerciseLogHash);

    return (
      <div className='workout-page offset-header'>
        <Header text={`${name}`} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgSmall='true'>
              <div className='d-flex justify-content-between w-100 mb-20px'>
                <Button text='Skip' type='secondary' position='left' className='flex-grow-1' />
                <Button text='Postpone' type='secondary' position='right' className='flex-grow-1' />
              </div>
              <Button
                text={buttonText}
                type='primary'
                position='center'
                className='w-100 mb-20px'
                onClick={onClick}
              />
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{name}</div>
                <div className='pb-2'>Program Name</div>
              </div>
              <ProgressBar progress={activeWorkoutLog.progress * 100} />
            </Col>
            <Col number='2' bgLarge='true'>
              {this.state.exercises.map((exerciseObj, i) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
