import React from 'react';
import './ProgramsPage.styles.scss';

import { connect } from 'react-redux';
import api from '../../utils/apiCalls';

import { getActiveExerciseLog } from '../../redux/exerciseLogs/exerciseLogs.actions';

// Components
import Header from '../../components/Header/Header.component';
import SelectProgramItem from '../../components/SelectProgramItem/SelectProgramItem.component';
import StickyBottom from '../../components/StickyBottom/StickyBottom.component';
import Button from '../../components/Button/Button.component';

class ProgramsPage extends React.Component {
  constructor(props) {
    super();

    this.props = props;
    this.state = {
      programs: undefined,
      selected: undefined,
    };
  }

  componentDidMount = () => {
    this.setData();
  };

  addProgramLog = async () => {
    let { selected, programs } = this.state;
    let { history } = this.props;

    let program_id = programs[selected].program_id;
    await api.addOne('program-logs', { program_id });

    history.push('/dashboard');
  };

  selectProgram = e => {
    let { selected } = this.state;
    let thisId = parseInt(e.target.closest('button').id);
    selected === thisId
      ? this.setState({ selected: undefined })
      : this.setState({ selected: thisId });
  };

  setData = async () => {
    let programs = await api.get('programs');
    this.setState({ programs }, () => console.log(this.state));
  };

  render() {
    let { programs, selected } = this.state;

    return (
      <div className='programs-page offset-header'>
        <Header text='Browse Programs' />
        <StickyBottom className='d-flex justify-content-center align-items-center'>
          {selected !== undefined ? (
            <Button
              text='Start Program'
              type='primary'
              className='w-100'
              onClick={this.addProgramLog}
            />
          ) : (
            <p className='text-16 text-primary bold'>Select a program to start.</p>
          )}
        </StickyBottom>
        <main className='content'>
          <div className='row'>
            <div className='col-md-8 offset-md-2'>
              {programs
                ? programs.map((program, i) => (
                    <SelectProgramItem
                      key={i}
                      program={program.name}
                      programLength={program.schedule.length}
                      company={program.company}
                      id={i}
                      onClick={this.selectProgram}
                      className={selected === i ? 'active' : ''}
                    />
                  ))
                : null}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getActiveExerciseLog: log => dispatch(getActiveExerciseLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgramsPage);
