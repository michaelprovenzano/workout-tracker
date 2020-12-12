import React, { useEffect } from 'react';
import './MyProgramsPage.styles.scss';
import moment from 'moment';
import api from '../../utils/apiCalls';

// Redux
import { connect } from 'react-redux';
import { setProgramLogs, getActiveProgramLog } from '../../redux/programLogs/programLogs.actions';
import { setStats } from '../../redux/stats/stats.actions';

// Components
import Header from '../../components/Header/Header.component';
import ProgramItem from '../../components/ProgramItem/ProgramItem.component';
import Button from '../../components/Button/Button.component';
import ProgressBar from '../../components/ProgressBar/ProgressBar.component';
import Col from '../../components/Col/Col.component';

const MyProgramsPage = ({
  activeProgramLog,
  programLogs,
  stats,
  setProgramLogs,
  getActiveProgramLog,
  setStats,
  history,
}) => {
  useEffect(() => {
    if (!programLogs) setProgramLogs();
    if (programLogs && !activeProgramLog) getActiveProgramLog();
    if (stats && activeProgramLog) {
      if (stats.program_log_id !== activeProgramLog.program_log_id)
        setStats(activeProgramLog.program_log_id);
    } else if (!stats && activeProgramLog) {
      setStats(activeProgramLog.program_log_id);
    }
    // eslint-disable-next-line
  }, [activeProgramLog, programLogs]);

  const abandonCurrentProgram = async () => {
    await api.updateOne('program-logs', activeProgramLog.program_log_id, { status: 'abandoned' });
    history.push('/dashboard');
  };

  const goToCurrentSchedule = () => {
    history.push(`/program-logs/${activeProgramLog.program_log_id}`);
  };

  if (!programLogs) return <div>Loading...</div>;

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
                  onClick={abandonCurrentProgram}
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
                  onClick={goToCurrentSchedule}
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
};

const mapStateToProps = state => ({
  ...state,
  activeProgramLog: state.programLogs.activeProgramLog,
  programLogs: state.programLogs.programLogs,
});

export default connect(mapStateToProps, { setProgramLogs, getActiveProgramLog, setStats })(
  MyProgramsPage
);
