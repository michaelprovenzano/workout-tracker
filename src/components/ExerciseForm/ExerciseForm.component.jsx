import React from 'react';
import './ExerciseForm.styles.scss';

import { connect } from 'react-redux';
import { setActiveWorkoutLog } from '../../redux/activeWorkoutLog/activeWorkoutLog.actions';
import { setActiveExerciseLog } from '../../redux/activeExerciseLog/activeExerciseLog.actions';
import api from '../../utils/apiCalls';

class ExerciseForm extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      selected: '',
      formData: {
        total_weight: this.props.exerciseLog.total_weight,
        total_reps: this.props.exerciseLog.total_reps,
        weight_left: this.props.exerciseLog.weight_left,
        weight_right: this.props.exerciseLog.weight_right,
        reps_left: this.props.exerciseLog.reps_left,
        reps_right: this.props.exerciseLog.reps_right,
        notes: this.props.exerciseLog.notes,
      },
      previousData: {
        total_weight: this.props.previousLog.total_weight,
        total_reps: this.props.previousLog.total_reps,
        weight_left: this.props.previousLog.weight_left,
        weight_right: this.props.previousLog.weight_right,
        reps_left: this.props.previousLog.reps_left,
        reps_right: this.props.previousLog.reps_right,
        notes: this.props.previousLog.notes,
      },
    };
  }

  componentWillUnmount = () => {
    this.updateExerciseLog(this.props.exerciseLog.exercise_log_id);
  };

  clearFormData = () => {
    let formData = {
      total_weight: '',
      total_reps: '',
      weight_left: '',
      weight_right: '',
      reps_left: '',
      reps_right: '',
      notes: '',
    };
    this.setState({ formData: formData });
  };

  updateExerciseLog = async exerciseLogId => {
    const { formData } = this.state;
    const { updateExerciseLog } = this.props;
    const exerciseLog = await api.updateOne('exercise-logs', exerciseLogId, formData);
    updateExerciseLog(exerciseLog);
  };

  selectRow = (e, selected) => {
    this.setState({ selected: selected });
  };

  setInputs = (e, field) => {
    let newFormData = { ...this.state.formData };
    newFormData[field] = e.target.value;
    this.setState({ formData: newFormData });
  };

  setFormData = log => {
    let { total_weight, total_reps, weight_left, weight_right, reps_left, reps_right, notes } = log;

    let formData = {
      total_weight,
      total_reps,
      weight_left,
      weight_right,
      reps_left,
      reps_right,
      notes,
    };

    this.setState({ formData: formData });
  };

  render() {
    console.log('rendered form');
    let { className, exercise, exerciseLog } = this.props;
    let { selected, previousData } = this.state;
    let {
      total_weight,
      total_reps,
      weight_left,
      weight_right,
      reps_left,
      reps_right,
      notes,
    } = this.state.formData;

    if (exercise.is_isometric)
      return (
        <div className={`exercise-form p-0 ${className}`}>
          <section className='row'>
            <div className='col-3 p-0'>
              <span className='label d-flex justify-content-center align-items-center'>Left</span>
            </div>
            <div className='details col-9 p-0'>
              <div className={`row ${selected === 'left reps' ? 'selected' : ''}`}>
                <div className='col-4 p-0 d-flex align-items-center bold'>Reps</div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  {' '}
                  {previousData.reps_left ? previousData.reps_left : '-'} reps
                </div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  <input
                    type='text'
                    name='current-reps'
                    id='current-reps'
                    className='w-100'
                    onFocus={e => this.selectRow(e, 'left reps')}
                    onBlur={e => this.selectRow(e, '')}
                    onChange={e => this.setInputs(e, 'reps_left')}
                    value={reps_left ? reps_left : ''}
                  />
                </div>
              </div>
              {exercise.has_weight ? (
                <div className={`row ${selected === 'left weight' ? 'selected' : ''}`}>
                  <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
                  <div className='col-4 p-0 d-flex align-items-center'>
                    {previousData.weight_left ? previousData.weight_left : '-'} lbs
                  </div>
                  <div className='col-4 p-0 d-flex align-items-center'>
                    <input
                      type='text'
                      name='current-weight'
                      id='current-weight'
                      className='w-100'
                      onFocus={e => this.selectRow(e, 'left weight')}
                      onBlur={e => this.selectRow(e, '')}
                      onChange={e => this.setInputs(e, 'weight_left')}
                      value={weight_left ? weight_left : ''}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          <section className='row'>
            <div className='col-3 p-0'>
              <span className='label d-flex justify-content-center align-items-center'>Right</span>
            </div>
            <div className='details col-9 p-0'>
              <div className={`row ${selected === 'right reps' ? 'selected' : ''}`}>
                <div className='col-4 p-0 d-flex align-items-center bold'>Reps</div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  {previousData.reps_right ? previousData.reps_right : '-'} reps
                </div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  <input
                    type='text'
                    name='current-reps'
                    id='current-reps'
                    className='w-100'
                    onFocus={e => this.selectRow(e, 'right reps')}
                    onBlur={e => this.selectRow(e, '')}
                    onChange={e => this.setInputs(e, 'reps_right')}
                    value={reps_right ? reps_right : ''}
                  />
                </div>
              </div>
              {exercise.has_weight ? (
                <div className={`row ${selected === 'right weight' ? 'selected' : ''}`}>
                  <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
                  <div className='col-4 p-0 d-flex align-items-center'>
                    {' '}
                    {previousData.weight_right ? previousData.weight_right : '-'} lbs
                  </div>
                  <div className='col-4 p-0 d-flex align-items-center'>
                    <input
                      type='text'
                      name='current-weight'
                      id='current-weight'
                      className='w-100'
                      onFocus={e => this.selectRow(e, 'right weight')}
                      onBlur={e => this.selectRow(e, '')}
                      onChange={e => this.setInputs(e, 'weight_right')}
                      value={weight_right ? weight_right : ''}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          <section className='d-flex w-100 current-notes'>
            <div>
              <span className='label d-flex justify-content-center align-items-center'>Notes</span>
            </div>
            <input
              type='text'
              name='current-notes'
              id='current-notes'
              className='flex-grow-1'
              onChange={e => this.setInputs(e, 'notes')}
              value={notes ? notes : ''}
            />
          </section>
        </div>
      );

    return (
      <div className={`exercise-form p-0 ${className}`}>
        <section className='row'>
          <div className='col-3 p-0'></div>
          <div className='details col-9 p-0'>
            <div className={`row ${selected === 'total reps' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Reps</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                {' '}
                {previousData.total_reps ? previousData.total_reps : '-'} reps
              </div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='text'
                  name='current-reps'
                  id='current-reps'
                  className='w-100'
                  onFocus={e => this.selectRow(e, 'total reps')}
                  onBlur={e => this.selectRow(e, '')}
                  onChange={e => this.setInputs(e, 'total_reps')}
                  value={total_reps ? total_reps : ''}
                />
              </div>
            </div>
            {exercise.has_weight ? (
              <div className={`row ${selected === 'total weight' ? 'selected' : ''}`}>
                <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  {previousData.total_weight ? previousData.total_weight : '-'} lbs
                </div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  <input
                    type='text'
                    name='current-weight'
                    id='current-weight'
                    className='w-100'
                    onFocus={e => this.selectRow(e, 'total weight')}
                    onBlur={e => this.selectRow(e, '')}
                    onChange={e => this.setInputs(e, 'total_weight')}
                    value={total_weight ? total_weight : ''}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>
        <section className='d-flex w-100 current-notes'>
          <div>
            <span className='label d-flex justify-content-center align-items-center'>Notes</span>
          </div>
          <input
            type='text'
            name='current-notes'
            id='current-notes'
            className='flex-grow-1'
            onChange={e => this.setInputs(e, 'notes')}
            value={notes ? notes : ''}
          />
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setActiveWorkoutLog: log => dispatch(setActiveWorkoutLog(log)),
  setActiveExerciseLog: log => dispatch(setActiveExerciseLog(log)),
});

const mapStateToProps = state => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseForm);
