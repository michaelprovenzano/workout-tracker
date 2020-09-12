import React from 'react';
import { connect } from 'react-redux';
import api from '../../utils/apiCalls';
import './Dashboard.styles.scss';

import { setActiveWorkout } from '../../redux/activeWorkout/activeWorkout.actions';
import { setActiveProgram } from '../../redux/activeProgram/activeProgram.actions';
import { setNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';

import Header from '../../components/Header/Header.component';
import ProgressRing from '../../components/ProgressRing/ProgressRing.component';
import ProgressCalendar from '../../components/ProgressCalendar/ProgressCalendar.component';
import StatRing from '../../components/StatRing/StatRing.component';
import WorkoutSticky from '../../components/WorkoutSticky/WorkoutSticky.component';

import Col from '../Col/Col.component';
import Button from '../../components/Button/Button.component';

class Dashboard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      activeProgramLog: null,
      activeWorkoutLog: null,
      nextWorkout: null,
      stats: null,
    };
  }

  getActiveProgram = async () => {
    let activeProgramLog = await api.get('program-logs', `status=active`);
    return activeProgramLog[0];
  };

  getActiveWorkoutLog = async workoutLogId => {
    let activeWorkoutLog = await api.getOne('workout-logs', workoutLogId);
    return activeWorkoutLog;
  };

  getNextWorkout = async activeProgramLog => {
    let nextWorkout;
    if (activeProgramLog) {
      nextWorkout = await api.get(
        'program-workouts',
        `program_workout_id=${activeProgramLog.next_program_workout}`
      );
      nextWorkout = nextWorkout[0];
    }

    return nextWorkout;
  };

  getData = async () => {
    let activeWorkoutLog, nextWorkout, stats;
    let activeProgramLog = await this.getActiveProgram();
    if (activeProgramLog && activeProgramLog.active_workout_log)
      activeWorkoutLog = await this.getActiveWorkoutLog(activeProgramLog.active_workout_log);
    if (activeProgramLog) {
      nextWorkout = await this.getNextWorkout(activeProgramLog);
      stats = await this.getStats(activeProgramLog.program_log_id);
    }

    return { activeProgramLog, activeWorkoutLog, nextWorkout, stats };
  };

  getStats = async programLogId => {
    let stats;
    if (programLogId) stats = await api.get(`util/program-log-stats/${programLogId}`);
    return stats.data;
  };

  browsePrograms = async () => {
    let { history } = this.props;
    history.push('/programs');
  };

  componentDidMount = () => {
    this.updateData();
  };

  skipWorkout = async () => {
    await api.patchReq('util/skip-workout', {}).then(() => this.updateData());
  };

  postponeWorkout = async () => {
    let { nextWorkout, activeProgramLog, activeWorkoutLog } = this.state;
    let response;

    if (activeWorkoutLog) {
      let { days_postponed } = activeWorkoutLog;
      response = await api.updateOne('workout-logs', activeProgramLog.active_workout_log, {
        days_postponed: days_postponed + 1,
      });
      this.setState({ activeWorkoutLog: response });
    } else {
      response = await api.addOne('workout-logs', {
        program_log_id: activeProgramLog.program_log_id,
        program_workout_id: nextWorkout.program_workout_id,
      });
    }
  };

  updateData = () => {
    this.getData().then(response => this.setState(response, () => console.log(this.state)));
  };

  render() {
    let { nextWorkout, activeProgramLog, activeWorkoutLog, stats } = this.state;

    return (
      <div className='offset-header'>
        <Header text='Dashboard' />
        {activeProgramLog ? (
          <WorkoutSticky
            activeProgramLog={activeProgramLog}
            activeWorkout={activeWorkoutLog}
            nextWorkout={nextWorkout}
            skip={this.skipWorkout}
            postpone={this.postponeWorkout}
            history={this.props.history}
          />
        ) : null}

        <main className='content dashboard'>
          {activeProgramLog ? (
            <div className='row'>
              <Col number='1'>
                <div className='d-flex justify-content-end align-items-center align-self-end mb-5'>
                  <div className='d-flex flex-column align-items-end progress-text'>
                    <h2 className='mt-0'>{activeProgramLog.name}</h2>
                    <small>Current Program</small>
                  </div>
                  <ProgressRing
                    radius='55'
                    stroke='5'
                    progress={Math.round(stats.progress * 100)}
                  />
                </div>
                <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
                  <StatRing unit='days' quantity={stats.totalCompletedWorkouts} stat='Completed' />
                  <StatRing unit='days' quantity={stats.totalRemainingWorkouts} stat='Remaining' />
                  <StatRing unit='days' quantity={stats.totalSkippedWorkouts} stat='Skipped' />
                </div>
                <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
                  <StatRing unit='days' quantity={stats.currentStreak} stat='Current Streak' />
                  <StatRing unit='days' quantity={stats.bestStreak} stat='Best Streak' />
                  <StatRing
                    unit='lbs'
                    quantity={stats.totalWeightLifted || 0}
                    stat='Weight Lifted'
                  />
                </div>
              </Col>
              <Col number='2'>
                <ProgressCalendar calendar={stats.calendar} />
              </Col>
            </div>
          ) : (
            <div className='row'>
              <div className='empty-state col-md-6 offset-md-3 d-flex flex-column align-items-center justify-content-center'>
                <h4 className='text-12 text-primary bold pb-4'>Let's Get Started!</h4>
                <p className='text-12 text-primary pb-4'>
                  Don’t be shy! It’s time to flex your muscles and show yourself what you’re made
                  of. Select a program!
                </p>
                <Button
                  text='Start a new program'
                  type='primary'
                  className='w-100'
                  onClick={this.browsePrograms}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   currentUser: state.user.currentUser,
// });

// const mapDispatchToProps = dispatch => ({
//   setActiveProgram: program => dispatch(setActiveProgram(program)),
//   setActiveWorkout: workout => dispatch(setActiveWorkout(workout)),
//   setNextWorkout: workout => dispatch(setNextWorkout(workout)),
// });

export default Dashboard;
