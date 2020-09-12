import React from 'react';
import './MySchedulePage.styles.scss';

import { connect } from 'react-redux';
import api from '../../utils/apiCalls';
import moment from 'moment';

import { setActiveExerciseLog } from '../../redux/activeExerciseLog/activeExerciseLog.actions';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../Col/Col.component';

class MySchedulePage extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      programLog: undefined,
      workoutLogs: undefined,
      workouts: undefined,
    };
  }

  componentDidMount = () => {
    this.setData();
  };

  setData = async () => {
    let { programLogId } = this.props.match.params;
    let workoutLogs, workouts;

    let programLog = await api.getOne('program-logs', programLogId);
    if (programLog) {
      workoutLogs = await api.get('workout-logs', `program_log_id=${programLog.program_log_id}`);
      workouts = await api.get('program-workouts', `program_id=${programLog.program_id}`);
    }

    this.setState({ programLog, workoutLogs, workouts }, () => console.log(this.state));
  };

  goToWorkoutLog = async e => {
    let { workouts, workoutLogs, programLog } = this.state;
    let { history } = this.props;

    let workoutIndex = parseInt(e.target.closest('button').id);
    let clickedWorkout = workouts[workoutIndex];

    // Check for a workout log
    let workoutLogIndex = workoutLogs.findIndex(
      item => item.program_workout_id === clickedWorkout.program_workout_id
    );

    if (workoutLogIndex === -1) {
      // Get the date for workout
      let workoutDate = programLog.workout_schedule[workoutIndex];

      // Create the log
      let response = await api.addOne('workout-logs', {
        program_log_id: programLog.program_log_id,
        program_workout_id: clickedWorkout.program_workout_id,
        date: workoutDate,
        active: false,
      });

      // Redirect
      history.push(`/workout-logs/${response.workout_log_id}`);
    } else {
      let workoutLog = workoutLogs[workoutLogIndex];
      history.push(`/workout-logs/${workoutLog.workout_log_id}`);
    }
  };

  render() {
    let { programLog, workoutLogs, workouts } = this.state;
    let { history } = this.props;

    let currentWorkoutDate;
    if (programLog) currentWorkoutDate = moment(programLog.start_date);

    // Hash workout logs
    let workoutLogHash = {};
    if (workoutLogs) {
      workoutLogs.forEach((workoutLog, i) => {
        workoutLogHash[workoutLog.program_workout_id] = {
          index: i,
          ...workoutLog,
        };
      });
    }

    return (
      <div className='my-programs-page offset-header'>
        <Header text='My Schedule' />
        <main className=''>
          <div className='row'>
            <Col number='1' bgLarge='true' className='workout-list'>
              {programLog ? (
                <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                  <div className='bold'>{programLog.name}</div>
                  {programLog.status === 'active' ? <small>Current Program</small> : null}
                </div>
              ) : null}
              <ProgressBar progress={`25`} />
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

                    if (workoutLogHash[workout.program_workout_id]) {
                      let log = workoutLogHash[workout.program_workout_id];
                      let index = log.index;
                      workout_log_id = log.workout_log_id;
                      workoutLogs[index].skipped ? (status = 'skipped') : (status = 'complete');
                      currentWorkoutDate = moment(log.date).format('MM/DD/YYYY');
                      console.log(log);
                    }

                    return (
                      <div className='w-100 d-flex flex-column align-items-center'>
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
                          complete={status === 'complete'}
                          skipped={status === 'skipped'}
                          history={history}
                          url={`/workout-logs/${workout_log_id}`}
                          onClick={this.goToWorkoutLog}
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
  }
}

// const mapDispatchToProps = dispatch => ({
//   setActiveExerciseLog: log => dispatch(setActiveExerciseLog(log)),
// });

// const mapStateToProps = state => ({
//   ...state,
// });

export default MySchedulePage;