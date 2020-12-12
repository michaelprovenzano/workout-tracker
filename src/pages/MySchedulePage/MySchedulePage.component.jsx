import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './MySchedulePage.styles.scss';

import { connect } from 'react-redux';
import { setCurrentProgramLog } from '../../redux/programLogs/programLogs.actions';
import { setCurrentWorkouts } from '../../redux/currentWorkouts/currentWorkouts.actions';
import { setWorkoutLogs, setCurrentWorkoutLog } from '../../redux/workoutLogs/workoutLogs.actions';
import { setCurrentWorkout } from '../../redux/currentWorkout/currentWorkout.actions';
import { clearCurrentExercises } from '../../redux/currentExercises/currentExercises.actions';
import { setStats } from '../../redux/stats/stats.actions';

import moment from 'moment';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../../components/Col/Col.component';

const MySchedulePage = ({
  programLog,
  workouts,
  stats,
  match,
  setCurrentProgramLog,
  setWorkoutLogs,
  currentWorkoutLog,
  currentWorkoutLogs,
  setCurrentWorkoutLog,
  setCurrentWorkouts,
  setCurrentWorkout,
  clearCurrentExercises,
  setStats,
}) => {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    clearCurrentExercises();
    const programLogId = match.params.programLogId;
    if (!programLog) setCurrentProgramLog(programLogId);
    if (!currentWorkoutLogs) setWorkoutLogs(programLogId);
    if (programLog && !workouts) setCurrentWorkouts(programLog.program_id);
    if (currentWorkoutLog && redirect)
      history.push(`/workout-logs/${currentWorkoutLog.workout_log_id}`);
    if (stats.program_log_id !== programLogId) setStats(programLogId);
    // eslint-disable-next-line
  }, [programLog, currentWorkoutLogs, workouts, stats, redirect]);

  const goToWorkoutLog = async (e, log) => {
    let clickedLog;
    if (log)
      clickedLog = currentWorkoutLogs.find(
        item => item.program_workout_id === log.program_workout_id
      );

    if (clickedLog) {
      setCurrentWorkoutLog(log);
      setCurrentWorkout(log.program_workout_id);
      setRedirect(true);
    }
  };

  if (!programLog || !currentWorkoutLogs || !workouts) return <div>Loading...</div>;

  let currentWorkoutDate;
  if (programLog) currentWorkoutDate = moment(programLog.start_date);

  // Hash workout logs
  let workoutLogHash = {};
  if (currentWorkoutLogs) {
    currentWorkoutLogs.forEach((workoutLog, i) => {
      workoutLogHash[workoutLog.program_workout_id] = {
        index: i,
        ...workoutLog,
      };
    });
  }

  return (
    <div className='my-programs-page offset-header'>
      <Header text='My Schedule' history={history} />
      <main className=''>
        <div className='row'>
          <Col number='1' bgLarge='true' className='workout-list'>
            {programLog ? (
              <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                <div className='bold'>{programLog.name}</div>
                {programLog.status === 'active' ? <small>Current Program</small> : null}
              </div>
            ) : null}
            <ProgressBar progress={stats ? stats.progress * 100 : 0} />
          </Col>
          <Col number='2'>
            {workouts
              ? workouts.map((workout, i) => {
                  let status, workout_log_id;

                  let increment = 1;
                  if (i === 0) increment = 0;
                  currentWorkoutDate = moment(currentWorkoutDate)
                    .add(increment, 'days')
                    .format('MM/DD/YYYY');

                  let log;
                  if (workoutLogHash[workout.program_workout_id]) {
                    log = workoutLogHash[workout.program_workout_id];
                    let index = log.index;
                    workout_log_id = log.workout_log_id;
                    currentWorkoutLogs[index].skipped
                      ? (status = 'skipped')
                      : (status = 'completed');
                    currentWorkoutDate = moment(log.date).format('MM/DD/YYYY');
                  }

                  return (
                    <div className='w-100 d-flex flex-column align-items-center' key={i}>
                      {i % 7 === 0 ? (
                        <header className='header-secondary w-100 d-flex align-items-center text-primary'>
                          Week {(i + 7) / 7}
                        </header>
                      ) : null}
                      <ProgramItem
                        key={i}
                        id={i}
                        name={workout.name}
                        date={currentWorkoutDate}
                        completed={status === 'completed'}
                        skipped={status === 'skipped'}
                        history={history}
                        url={`/workout-logs/${workout_log_id}`}
                        onClick={e => goToWorkoutLog(e, log)}
                        workout
                      />
                    </div>
                  );
                })
              : null}
          </Col>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state,
  programLog: state.programLogs.currentProgramLog,
  currentWorkoutLogs: state.workoutLogs.workoutLogs,
  workouts: state.currentWorkouts,
  currentWorkoutLog: state.workoutLogs.currentWorkoutLog,
});

export default connect(mapStateToProps, {
  setCurrentProgramLog,
  setCurrentWorkouts,
  clearCurrentExercises,
  setCurrentWorkout,
  setWorkoutLogs,
  setCurrentWorkoutLog,
  setStats,
})(MySchedulePage);
