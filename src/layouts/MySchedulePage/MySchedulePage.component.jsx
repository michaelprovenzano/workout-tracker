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

  render() {
    let { programLog, workoutLogs, workouts } = this.state;
    let { history } = this.props;
    let workoutLogHash = {};
    if (workoutLogs) {
      workoutLogs.forEach((workoutLog, i) => {
        console.log(workoutLog);
        workoutLogHash[workoutLog.program_workout_id] = { index: i };
      });

      console.log(workoutLogHash);
    }

    return (
      <div className='my-programs-page offset-header'>
        <Header text='My Programs' />
        <main className=''>
          <div className='row'>
            <Col number='1' bgLarge='true' className='workout-list'>
              <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                <div className='bold'>Program Name</div>
                <small>Current Program</small>
              </div>
              <ProgressBar progress={`25`} />
            </Col>
            <Col number='2'>
              <header className='header-secondary d-flex align-items-center text-primary w-100'>
                Week 1
              </header>

              {workouts
                ? workouts.map((workout, i) => {
                    let status;

                    if (workoutLogHash[workout.program_workout_id]) {
                      let index = workoutLogHash[workout.program_workout_id].index;
                      workoutLogs[index].skipped ? (status = 'skipped') : (status = 'complete');
                    }

                    let date = moment(programLog.workout_schedule[workout.workout_order]).format(
                      'MM/DD/YYYY'
                    );

                    return (
                      <ProgramItem
                        key={i}
                        id={workout.workout_log_id}
                        name={workout.name}
                        date={date}
                        complete={status === 'complete'}
                        skipped={status === 'skipped'}
                        history={history}
                        url={`/workout-logs/${workout.workout_log_id}`}
                        workout
                      />
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

const mapDispatchToProps = dispatch => ({
  setActiveExerciseLog: log => dispatch(setActiveExerciseLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(MySchedulePage);
