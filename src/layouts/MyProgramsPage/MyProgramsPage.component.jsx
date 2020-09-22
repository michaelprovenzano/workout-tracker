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
      stats: undefined,
    };
  }

  abandonCurrentProgram = async () => {
    let { activeProgramLog } = this.state;
    let { history } = this.props;

    await api.updateOne('program-logs', activeProgramLog.program_log_id, { status: 'abandoned' });
    history.push('/dashboard');
  };

  componentDidMount = () => {
    this.setData();
  };

  getStats = async programLogId => {
    let stats;
    if (programLogId) stats = await api.get(`util/program-log-stats/${programLogId}`);
    return stats.data;
  };

  goToCurrentSchedule = () => {
    let { activeProgramLog } = this.state;
    let { history } = this.props;
    history.push(`/program-logs/${activeProgramLog.program_log_id}`);
  };

  setData = async () => {
    // Get all data for programs page
    let programLogs = await api.get('program-logs', 'orderBy=[desc]start_date');

    // Get index of exercise log
    let activeProgramLogIndex = programLogs.findIndex(log => log.status === 'active');
    let activeProgramLog = programLogs[activeProgramLogIndex];

    let stats;
    if (activeProgramLog) await this.getStats(activeProgramLog.program_log_id);

    this.setState({ programLogs, activeProgramLog, stats }, () => console.log(this.state));
  };

  render() {
    let { activeProgramLog, programLogs, stats } = this.state;
    let { history } = this.props;

    return (
      <div className='my-programs-page offset-header'>
        <Header text='My Programs' history={history} />
        <main className=''>
          <div className='row'>
            <Col number='1' bgLarge='true' className='workout-list'>
              <div className='workout-program d-flex flex-column align-items-center w-100 mb-3'>
                <div className='bold'>{activeProgramLog ? activeProgramLog.name : null}</div>
                <small>Current Program</small>
              </div>
              <ProgressBar progress={stats ? stats.progress * 100 : 0} />
              <div className='row w-100 btn-group'>
                <div className='col-4 col-md-12'>
                  <Button
                    text='Abandon'
                    type='danger'
                    position='center'
                    className='w-100'
                    onClick={this.abandonCurrentProgram}
                  />
                </div>
                <div className='col-4 col-md-12'>
                  <Button text='Stats' type='primary' position='center' className='w-100' />
                </div>
                <div className='col-4 col-md-12'>
                  <Button
                    text='Schedule'
                    type='primary'
                    position='center'
                    className='w-100'
                    onClick={this.goToCurrentSchedule}
                  />
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

                    let abandoned = log.status === 'abandoned';
                    let completed = log.status === 'completed';

                    return (
                      <ProgramItem
                        key={i}
                        name={`${log.name}`}
                        dateRange={`${startDate} - ${endDate}`}
                        history={history}
                        url={`/program-logs/${log.program_log_id}`}
                        abandoned={abandoned}
                        completed={completed}
                        program
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProgramsPage);
