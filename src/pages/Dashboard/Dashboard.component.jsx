import React, { Fragment, useEffect } from 'react';
import './Dashboard.styles.scss';

// Redux
import { connect } from 'react-redux';
import { setWorkoutLogs, getActiveWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import { getActiveProgramLog } from '../../redux/programLogs/programLogs.actions';
import { getNextWorkout } from '../../redux/nextWorkout/nextWorkout.actions';
import { setStats } from '../../redux/stats/stats.actions';

// Components
import Header from '../../components/Header/Header.component';
import ProgressRing from '../../components/ProgressRing/ProgressRing.component';
import ProgressCalendar from '../../components/ProgressCalendar/ProgressCalendar.component';
import StatRing from '../../components/StatRing/StatRing.component';
import WorkoutSticky from '../../components/WorkoutSticky/WorkoutSticky.component';

import Col from '../../components/Col/Col.component';
import Button from '../../components/Button/Button.component';

const Dashboard = ({
  activeProgramLog,
  nextWorkout,
  stats,
  getActiveProgramLog,
  setWorkoutLogs,
  getActiveWorkoutLog,
  getNextWorkout,
  setStats,
  history,
}) => {
  useEffect(() => {
    if (!activeProgramLog) {
      getActiveProgramLog();
    } else {
      let id = activeProgramLog.program_log_id;
      setWorkoutLogs(id);
      getActiveWorkoutLog(id);
      if (!nextWorkout || Object.keys(nextWorkout).length === 0) getNextWorkout(activeProgramLog);
      setStats(id);
    }
    // eslint-disable-next-line
  }, [activeProgramLog, nextWorkout]);

  const browsePrograms = async () => {
    history.push('/programs');
  };

  return (
    <div className='offset-header'>
      <Header text='Dashboard' />
      {activeProgramLog ? <WorkoutSticky nextWorkout={nextWorkout} /> : null}

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
                onClick={browsePrograms}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  activeProgramLog: state.programLogs.activeProgramLog,
  activeWorkoutLog: state.workoutLogs.activeWorkoutLog,
  workoutLogs: state.workoutLogs,
  stats: state.stats,
});

const mapDispatchToProps = {
  setWorkoutLogs,
  getActiveProgramLog,
  getActiveWorkoutLog,
  getNextWorkout,
  setStats,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
