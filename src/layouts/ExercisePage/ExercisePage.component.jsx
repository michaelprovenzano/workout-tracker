import React from 'react';
import './ExercisePage.styles.scss';

import { connect } from 'react-redux';
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
      exercises: [],
      activeExercise: 0,
    };
  }

  componentDidMount = async () => {
    let { workoutLogId, exerciseLogId } = this.props.match.params;

    let exercises = [];
    let workoutLog = await api.getOne('workout-logs', workoutLogId);
    let workout = await api.getOne('workouts', workoutLog.workout_id);
    let exerciseLog = await api.getOne('exercise-logs', exerciseLogId);

    for (let i = 0; i < workout.exercises.length; i++) {
      let exerciseData = await api.getOne('exercises', workout.exercises[i]);
      exerciseData.key = i;
      exercises.push(exerciseData);
    }

    this.setState({
      workout: workout,
      exercises: exercises,
      exerciseLog: exerciseLog,
      activeExercise: exercises[0],
    });
  };

  makeActive = id => {
    let activeExercise = this.state.exercises.find(item => item.id === id);
    this.setState({
      activeExercise: activeExercise,
    });
  };

  render() {
    let exerciseName = '',
      workoutName = '',
      activeExercise;

    if (this.state.exercises.length > 0) {
      activeExercise = this.state.activeExercise;
      exerciseName = activeExercise.exercise;
    }

    return (
      <div className='workout-page offset-header'>
        <Header text={`${exerciseName}`} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgSmall='true'>
              <div className='workout-program d-flex justify-content-between w-100'>
                <div className='pb-2'>{workoutName}</div>
                <div className='pb-2'>P90X3</div>
              </div>
              <ProgressBar progress='25' />
              <div className='hidden-sm-down'>
                {this.state.exercises.map((exerciseObj, i) => {
                  let { exercise, is_isometric, has_weight, id } = exerciseObj;
                  return (
                    <ExerciseItem
                      name={`${exercise}`}
                      weights={`${has_weight}`}
                      isometric={`${is_isometric}`}
                      key={i}
                      active={this.state.activeExercise.id === id}
                      onClick={() => this.makeActive(id)}
                    />
                  );
                })}
              </div>
            </Col>
            <Col number='2' bgLarge='true'>
              <div className='w-100'>
                <h4>Notes from last time:</h4>
                <div className='notes-prev'>More weight next time</div>
              </div>
              <header className='table-header row w-100'>
                <div className='col-3 offset-6 p-0 d-flex align-items-center'>Previous</div>
                <div className='col-3 p-0 d-flex align-items-center justify-content-center bold'>
                  Current
                </div>
              </header>
              <ExerciseForm className='w-100' />
            </Col>
            <PrevNext />
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps)(ExercisePage);
