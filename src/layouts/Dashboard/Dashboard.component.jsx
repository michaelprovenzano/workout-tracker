import React from 'react';
import { connect } from 'react-redux';
import api from '../../utils/apiCalls';
import './Dashboard.styles.scss';

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
      nextWorkout: null,
    };
  }

  getActiveProgram = async () => {
    let activeProgram;
    activeProgram = await api.get('program-logs', `status=active`);
    activeProgram = activeProgram[0];

    // Set the active program in redux
    this.props.setActiveProgram(activeProgram);

    // Set the next workout in redux
    this.getNextWorkout(activeProgram);

    // Set the state for dashboard
    this.setState({
      activeProgram: activeProgram,
    });
  };

  getNextWorkout = async activeProgram => {
    let nextWorkout;

    if (activeProgram) nextWorkout = await api.getOne('workouts', activeProgram.next_workout);

    this.props.setNextWorkout(nextWorkout);

    // Set the state for dashboard
    this.setState(
      {
        nextWorkout: nextWorkout,
      },
      () => console.log(this.state)
    );
  };

  componentDidMount = () => {
    this.getActiveProgram();
  };

  render() {
    let { nextWorkout, activeProgram } = this.state;

    return (
      <div className='offset-header'>
        <Header text='Dashboard' />
        {activeProgram ? (
          <WorkoutSticky
            activeProgram={activeProgram}
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
  setNextWorkout: workout => dispatch(setNextWorkout(workout)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
