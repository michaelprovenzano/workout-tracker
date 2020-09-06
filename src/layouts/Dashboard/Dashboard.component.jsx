import React from 'react';
import { connect } from 'react-redux';
import api from '../../utils/apiCalls';
import './Dashboard.styles.scss';

import { setActiveWorkout } from '../../redux/activeWorkout/activeWorkout.actions';
import { setActiveProgram } from '../../redux/activeProgram/activeProgram.actions';
import { setNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';

import Header from '../../components/Header/Header.component';
import ProgressRing from '../../components/ProgressRing/ProgressRing.component';
import StatRing from '../../components/StatRing/StatRing.component';
import WorkoutSticky from '../../components/WorkoutSticky/WorkoutSticky.component';

import Col from '../Col/Col.component';

class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeProgram: null,
      activeWorkout: null,
      nextWorkout: null,
    };
  }

  getActiveProgram = async () => {
    let activeProgram = await api.get('program-logs', `status=active`);
    return activeProgram[0];
  };

  getActiveWorkoutLog = async workoutLogId => {
    let activeWorkoutLog = await api.getOne('workout-logs', workoutLogId);

    let activeWorkout;
    if (activeWorkoutLog) activeWorkout = await api.getOne('workouts', activeWorkoutLog.workout_id);

    return activeWorkout;
  };

  getNextWorkout = async activeProgram => {
    let nextWorkout;
    if (activeProgram) {
      nextWorkout = await api.get(
        'program-workouts',
        `program_workout_id=${activeProgram.next_workout}`
      );
      nextWorkout = nextWorkout[0];
    }

    return nextWorkout;
  };

  getData = async () => {
    let activeProgram = await this.getActiveProgram();
    let activeWorkout = await this.getActiveWorkoutLog(activeProgram.active_workout_log);
    let nextWorkout = await this.getNextWorkout(activeProgram);

    return { activeProgram, activeWorkout, nextWorkout };
  };

  componentDidMount = () => {
    this.getData().then(response => this.setState(response, () => console.log(this.state)));
  };

  render() {
    let { nextWorkout, activeProgram, activeWorkout } = this.state;

    return (
      <div className='offset-header'>
        <Header text='Dashboard' />
        {activeProgram ? (
          <WorkoutSticky
            activeProgram={activeProgram}
            activeWorkout={activeWorkout}
            nextWorkout={nextWorkout}
            history={this.props.history}
          />
        ) : null}

        <main className='content'>
          <div className='row'>
            <Col number='1'>
              <div className='d-flex justify-content-end align-items-center align-self-end mb-5'>
                <div className='d-flex flex-column align-items-end progress-text'>
                  <h2 className='mt-0'>P90X3</h2>
                  <small>Current Program</small>
                </div>
                <ProgressRing radius='55' stroke='5' progress='50' />
              </div>
              <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
                <StatRing unit='days' quantity='0' stat='Completed' />
                <StatRing unit='days' quantity='90' stat='Remaining' />
                <StatRing unit='days' quantity='0' stat='Skipped' />
              </div>
              <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
                <StatRing unit='days' quantity='0' stat='Current Streak' />
                <StatRing unit='days' quantity='90' stat='Best Streak' />
                <StatRing unit='lbs' quantity='0' stat='Weight Lifted' />
              </div>
            </Col>
            <Col number='2'>
              {/* {hasExercises ? <div>`${JSON.stringify(this.state.exercises)}`</div> : null} */}
            </Col>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = dispatch => ({
  setActiveProgram: program => dispatch(setActiveProgram(program)),
  setActiveWorkout: workout => dispatch(setActiveWorkout(workout)),
  setNextWorkout: workout => dispatch(setNextWorkout(workout)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
