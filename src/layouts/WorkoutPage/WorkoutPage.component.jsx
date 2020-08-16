import React from 'react';
import './WorkoutPage.styles.scss';

import { connect } from 'react-redux';
import { setAuthHeader } from '../../utils/cookieController';
import api from '../../utils/apiCalls';

import Header from '../../components/Header/Header.component';
import Button from '../../components/Button/Button.component';
import ExerciseItem from '../../components/ExerciseItem/ExerciseItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import { Redirect } from 'react-router-dom';

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
      referrer: null,
    };
  }

  componentDidMount = async () => {
    let { workoutLogId } = this.props.match.params;
    let exercises = [];

    let workoutLog = await api.getOne('workout-logs', workoutLogId);
    let workout = await api.getOne('workouts', workoutLog.workout_id);

    // Get current exercise logs
    let exerciseLogs = await api.getExerciseLogs(`workout_log_id=${workoutLogId}`);

    // Create hash table of ids
    let exerciseLogIds = {};
    exerciseLogs.forEach(item => (exerciseLogIds[item.exercise_id] = item.id));

    for (let i = 0; i < workout.exercises.length; i++) {
      let exerciseData = await getExerciseById(workout.exercises[i]);
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
    let workoutLogId = this.state.workoutLog.id;

    if (logId) {
      this.setState({
        referrer: `/workout-logs/${workoutLogId}/${logId}`,
      });
    } else {
      let exerciseLog = await api.addOne('exercise-logs', { exercise_id: exerciseId });
      this.setState({
        referrer: `/workout-logs/${workoutLogId}/${exerciseLog.id}`,
      });
    }
  };

  render() {
    let name = '';
    if (this.state.workout) name = this.state.workout.name;
    if (this.state.referrer) return <Redirect to={this.state.referrer} />;

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

const getExerciseById = async id => {
  let response = await fetch(`http://localhost:8000/api/exercises/${id}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: setAuthHeader(),
    },
  });
  let data = await response.json();
  return data[0];
};

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(WorkoutPage);
