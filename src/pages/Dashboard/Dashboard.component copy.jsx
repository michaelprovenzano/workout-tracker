import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../utils/apiCalls';
import './Dashboard.styles.scss';

import { getWorkoutLogs, getActiveWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import { getActiveProgramLog } from '../../redux/activeProgramLog/activeProgramLog.actions';
import { getStats } from '../../redux/stats/stats.actions';

import Header from '../../components/Header/Header.component';
import ProgressRing from '../../components/ProgressRing/ProgressRing.component';
import ProgressCalendar from '../../components/ProgressCalendar/ProgressCalendar.component';
import StatRing from '../../components/StatRing/StatRing.component';
import WorkoutSticky from '../../components/WorkoutSticky/WorkoutSticky.component';

import Col from '../../components/Col/Col.component';
import Button from '../../components/Button/Button.component';

const Dashboard = ({ activeProgramLog, workoutLogs, stats }) => {
  // const getNextWorkout = async activeProgramLog => {
  //   let workouts = await api.get(
  //     'program-workouts',
  //     `program_id=${activeProgramLog.program_id}&orderBy=workout_order`
  //   );
  //   let workoutLogs = await api.get(
  //     'workout-logs',
  //     `program_log_id=${activeProgramLog.program_log_id}&orderBy=workout_order`
  //   );

  //   // Set the state
  //   this.setState({ workouts, workoutLogs }, () => console.log(this.state));

  //   // If starting a new program, set the first workout
  //   if (workoutLogs.length === 0) return workouts[0];

  //   for (let i = workouts.length - 1; i >= 0; i--) {
  //     let thisWorkout = workouts[i];
  //     if (thisWorkout.workout_order === workoutLogs[workoutLogs.length - 1].workout_order) {
  //       return workouts[i + 1];
  //     }
  //   }

  //   return undefined;
  // };

  // const getData = async () => {
  //   let activeWorkoutLog, nextWorkout, stats;
  //   const { activeProgramLog } = this.props;

  //   if (activeProgramLog) {
  //     activeWorkoutLog = await this.getActiveWorkoutLog(activeProgramLog);
  //     nextWorkout = await this.getNextWorkout(activeProgramLog);
  //     stats = await this.getStats(activeProgramLog.program_log_id);
  //   }

  //   return { activeProgramLog, activeWorkoutLog, nextWorkout, stats };
  // };

  // const browsePrograms = async () => {
  //   let { history } = this.props;
  //   history.push('/programs');
  // };

  // const componentDidMount = () => {
  //   const { activeProgramLog } = this.props;

  //   this.props.getActiveProgramLog();
  //   this.props.getWorkoutLogs();
  //   this.props.getActiveWorkoutLog();
  //   this.props.getStats(activeProgramLog.program_log_id);
  //   // this.updateData();
  // };

  useEffect(() => {
    getActiveProgramLog();
    getWorkoutLogs();
    getActiveWorkoutLog();
    getStats(activeProgramLog.program_log_id);
  }, []);

  const skipWorkout = async programWorkoutId => {
    // let { activeProgramLog, activeWorkoutLog, workoutLogs, workouts } = this.state;
    // let logIndex, workoutLog;
    // let workoutIndex = workouts.findIndex(
    //   workout => workout.program_workout_id === programWorkoutId
    // );
    // if (workoutLogs) {
    //   logIndex = workoutLogs.findIndex(log => log.program_workout_id === programWorkoutId);
    //   workoutLog = workoutLogs[logIndex];
    // }
    // if (logIndex >= 0) {
    //   let workoutLogId = workoutLog.workout_log_id;
    //   await api
    //     .updateOne('workout-logs', workoutLogId, { active: false, skipped: true })
    //     .then(() => this.updateData());
    // } else {
    //   let nextWorkout = workouts[workoutIndex];
    //   await api
    //     .addOne('workout-logs', {
    //       program_log_id: activeProgramLog.program_log_id,
    //       program_workout_id: nextWorkout.program_workout_id,
    //       skipped: true,
    //       active: false,
    //     })
    //     .then(() => this.updateData());
    // }
    // if (activeWorkoutLog) {
    //   await api.updateOne('workout-logs', activeWorkoutLog.workout_log_id, { active: false });
    //   this.setState({ activeWorkoutLog: null });
    // }
  };

  // let { nextWorkout } = this.state;
  let nextWorkout;

  if (!activeProgramLog) return <h1>Loading</h1>;

  return (
    <div className='offset-header'>
      <Header text='Dashboard' />
      {/* {activeProgramLog ? (
        <WorkoutSticky
          activeProgramLog={activeProgramLog}
          activeWorkoutLog={activeWorkoutLog}
          nextWorkout={nextWorkout}
          skip={this.skipWorkout}
          history={this.props.history}
        />
      ) : null} */}

      <main className='content dashboard'>
        {activeProgramLog ? (
          <div className='row'>
            <Col number='1'>
              <div className='d-flex justify-content-end align-items-center align-self-end mb-5'>
                <div className='d-flex flex-column align-items-end progress-text'>
                  <h2 className='mt-0'>{activeProgramLog.name}</h2>
                  <small>Current Program</small>
                </div>
                {stats && (
                  <ProgressRing
                    radius='55'
                    stroke='5'
                    progress={Math.round(stats.progress * 100)}
                  />
                )}
              </div>
              {stats && (
                <Fragment>
                  <div className='d-flex justify-content-between align-items-start w-100 pb-5'>
                    <StatRing
                      unit='days'
                      quantity={stats.totalCompletedWorkouts}
                      stat='Completed'
                    />
                    <StatRing
                      unit='days'
                      quantity={stats.totalRemainingWorkouts}
                      stat='Remaining'
                    />
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
                </Fragment>
              )}
            </Col>
            <Col number='2'>{stats && <ProgressCalendar calendar={stats.calendar} />}</Col>
          </div>
        ) : (
          <div className='row'>
            <div className='empty-state col-md-6 offset-md-3 d-flex flex-column align-items-center justify-content-center'>
              <h4 className='text-12 text-primary bold pb-4'>Let's Get Started!</h4>
              <p className='text-12 text-primary pb-4'>
                Don’t be shy! It’s time to flex your muscles and show yourself what you’re made of.
                Select a program!
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
};

const mapStateToProps = state => ({
  // currentUser: state.user.currentUser,
  activeProgramLog: state.activeProgramLog,
  workoutLogs: state.workoutLogs,
  stats: state.stats,
});

const mapDispatchToProps = { getWorkoutLogs, getActiveProgramLog, getActiveWorkoutLog, getStats };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
