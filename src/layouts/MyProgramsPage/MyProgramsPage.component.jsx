import React from 'react';
import './MyProgramsPage.styles.scss';
import moment from 'moment';
import { connect } from 'react-redux';
import api from '../../utils/apiCalls';

import { setActiveExerciseLog } from '../../redux/activeExerciseLog/activeExerciseLog.actions';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import Button from '../../components/Button/Button.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../Col/Col.component';

class MyProgramsPage extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      programLogs: undefined,
      activeProgramLog: undefined,
    };
  }

  componentDidMount = () => {
    this.setData();
  };

  setData = async () => {
    // Get all data for programs page
    let programLogs = await api.get('program-logs');

    // Get index of exercise log
    let activeProgramLog = programLogs.findIndex(log => log.status === 'active');

    this.setState({ programLogs, activeProgramLog }, () => console.log(this.state));
  };

  render() {
    let { activeProgramLog, programLogs } = this.state;
    let { history } = this.props;

    return (
      <div className='my-programs-page offset-header'>
        <Header text='My Programs' />
        <main className=''>
          <div className='row'>
            <Col number='1' bgLarge='true' className='workout-list'>
              <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                <div className='bold'>
                  {programLogs ? programLogs[activeProgramLog].name : null}
                </div>
                <small>Current Program</small>
              </div>
              <ProgressBar progress={`25`} />
              <div className='row w-100 btn-group'>
                <div className='col-4 col-md-12'>
                  <Button text='Abandon' type='danger' position='center' className='w-100' />
                </div>
                <div className='col-4 col-md-12'>
                  <Button text='Stats' type='primary' position='center' className='w-100' />
                </div>
                <div className='col-4 col-md-12'>
                  <Button text='Schedule' type='primary' position='center' className='w-100' />
                </div>
              </div>
            </Col>
            <Col number='2'>
              <header className='header-secondary d-flex align-items-center text-primary w-100'>
                Past Programs
              </header>
              {programLogs
                ? programLogs.map((log, i) => {
                    let startDate = moment(log.workout_schedule[0]).format('MM/DD/YYYY');
                    let endDate = moment(
                      log.workout_schedule[log.workout_schedule.length - 1]
                    ).format('MM/DD/YYYY');

                    return (
                      <ProgramItem
                        key={i}
                        name={`${log.name}`}
                        dateRange={`${startDate} - ${endDate}`}
                        history={history}
                        url={`/program-logs/${log.program_log_id}`}
                        program
                      />
                    );
                  })
                : null}
              {/* <div className='hidden-sm-down'>
                {this.state.exercises.map((exerciseObj, i) => {
                  let { exercise, is_isometric, has_weight, id } = exerciseObj;
                  let complete;
                  let exerciseLogIndex = workoutLog.exercise_logs.findIndex(
                    exerciseLog => exerciseLog.exercise_id === id
                  );
                  exerciseLogIndex >= 0 && !(activeExercise.id === id)
                    ? (complete = true)
                    : (complete = false);
                  return (
                    <ExerciseItem
                      name={`${exercise}`}
                      weights={`${has_weight}`}
                      isometric={`${is_isometric}`}
                      key={i}
                      active={activeExercise.id === id}
                      complete={complete}
                      onClick={() => this.makeActive(id)}
                    />
                  );
                })}
              </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProgramsPage);
