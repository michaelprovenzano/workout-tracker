import React from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
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
    let exercises = [];

    let workoutLog = await api.getOne('workout-logs', workoutLogId);

    // Get the workout and set it in redux
    let workout = await api.getOne('workouts', workoutLog.workout_id);
    this.props.setActiveWorkout(workout);

    // Get current exercise logs
    let exerciseLogs = await api.get('exercise-logs', `workout_log_id=${workoutLogId}`);
    workoutLog.exercise_logs = exerciseLogs;

    this.props.setActiveWorkoutLog(workoutLog);

    // Create hash table of ids
    let exerciseLogIds = {};
    exerciseLogs.forEach(item => (exerciseLogIds[item.exercise_id] = item.id));

    // Get the exercises for the current workout
    for (let i = 0; i < workout.exercises.length; i++) {
      let exerciseData = await api.getOne('exercises', workout.exercises[i]);
      exerciseData.key = i;
      exercises.push(exerciseData);
    }

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

  goToExerciseLog = async (logId, exerciseId) => {
    let { history } = this.props;
    let workoutLogId = this.state.workoutLog.id;

    if (logId) {
      history.push(`/workout-logs/${workoutLogId}/${logId}`);
    } else {
      let exerciseLog = await api.addOne('exercise-logs', { exercise_id: exerciseId });
      history.push(`/workout-logs/${workoutLogId}/${exerciseLog.id}`);
    }
  };

  render() {
    let name = '';
    if (this.state.workout) name = this.state.workout.name;

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
              <Button text='Start' type='primary' position='center' className='w-100 mb-20px' />
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{name}</div>
                <div className='pb-2'>P90X3</div>
              </div>
              <ProgressBar progress='25' />
            </Col>
            <Col number='2' bgLarge='true'>
              {this.state.exercises.map((exerciseObj, i) => {
                let logId;
                let { exercise, is_isometric, has_weight, id } = exerciseObj;
                let hasLog = this.state.exerciseLogIds[exerciseObj.id];
                if (hasLog) logId = this.state.exerciseLogIds[exerciseObj.id];
                return (
                  <ExerciseItem
                    name={`${exercise}`}
                    weights={`${has_weight}`}
                    isometric={`${is_isometric}`}
                    key={i}
                    onClick={() => this.goToExerciseLog(logId, id)}
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
  setActiveWorkout: workout => dispatch(setActiveWorkout(workout)),
  setActiveWorkoutLog: log => dispatch(setActiveWorkoutLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
