import React, { useState, useEffect } from 'react';
import './ExerciseForm.styles.scss';

import { updateCurrentExerciseLog } from '../../redux/exerciseLogs/exerciseLogs.actions';

import { connect } from 'react-redux';

const ExerciseForm = ({
  className,
  exercise,
  currentLog,
  previousLog,
  updateCurrentExerciseLog,
}) => {
  const [selected, setSelected] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(currentLog);
    // eslint-disable-next-line
  }, [currentLog]);

  const selectRow = (e, selected) => {
    setSelected(selected);
  };

  const setInputs = (e, field) => {
    let newFormData = { ...formData };
    newFormData[field] = e.target.value;
    setFormData(newFormData);
    updateCurrentExerciseLog(newFormData);
  };

  let {
    total_weight,
    total_reps,
    weight_left,
    weight_right,
    reps_left,
    reps_right,
    notes,
  } = formData;

  if (!exercise) return <div>Loading...</div>;

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
                {previousLog.reps_left ? previousLog.reps_left : '-'} reps
              </div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='number'
                  pattern='[0-9]*'
                  name='current-reps'
                  id='current-reps'
                  className='w-100'
                  onFocus={e => selectRow(e, 'left reps')}
                  onBlur={e => selectRow(e, '')}
                  onChange={e => setInputs(e, 'reps_left')}
                  value={reps_left ? reps_left : ''}
                />
              </div>
            </div>
            {exercise.has_weight ? (
              <div className={`row ${selected === 'left weight' ? 'selected' : ''}`}>
                <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  {previousLog.weight_left ? previousLog.weight_left : '-'} lbs
                </div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  <input
                    type='number'
                    pattern='[0-9]*'
                    name='current-weight'
                    id='current-weight'
                    className='w-100'
                    onFocus={e => selectRow(e, 'left weight')}
                    onBlur={e => selectRow(e, '')}
                    onChange={e => setInputs(e, 'weight_left')}
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
                {previousLog.reps_right ? previousLog.reps_right : '-'} reps
              </div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='number'
                  pattern='[0-9]*'
                  name='current-reps'
                  id='current-reps'
                  className='w-100'
                  onFocus={e => selectRow(e, 'right reps')}
                  onBlur={e => selectRow(e, '')}
                  onChange={e => setInputs(e, 'reps_right')}
                  value={reps_right ? reps_right : ''}
                />
              </div>
            </div>
            {exercise.has_weight ? (
              <div className={`row ${selected === 'right weight' ? 'selected' : ''}`}>
                <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  {' '}
                  {previousLog.weight_right ? previousLog.weight_right : '-'} lbs
                </div>
                <div className='col-4 p-0 d-flex align-items-center'>
                  <input
                    type='number'
                    pattern='[0-9]*'
                    name='current-weight'
                    id='current-weight'
                    className='w-100'
                    onFocus={e => selectRow(e, 'right weight')}
                    onBlur={e => selectRow(e, '')}
                    onChange={e => setInputs(e, 'weight_right')}
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
          <textarea
            type='text'
            name='current-notes'
            id='current-notes'
            className='flex-grow-1'
            onChange={e => setInputs(e, 'notes')}
            value={notes ? notes : ''}
          ></textarea>
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
              {previousLog.total_reps ? previousLog.total_reps : '-'} reps
            </div>
            <div className='col-4 p-0 d-flex align-items-center'>
              <input
                type='number'
                pattern='[0-9]*'
                name='current-reps'
                id='current-reps'
                className='w-100'
                onFocus={e => selectRow(e, 'total reps')}
                onBlur={e => selectRow(e, '')}
                onChange={e => setInputs(e, 'total_reps')}
                value={total_reps ? total_reps : ''}
              />
            </div>
          </div>
          {exercise.has_weight ? (
            <div className={`row ${selected === 'total weight' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                {previousLog.total_weight ? previousLog.total_weight : '-'} lbs
              </div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='number'
                  pattern='[0-9]*'
                  name='current-weight'
                  id='current-weight'
                  className='w-100'
                  onFocus={e => selectRow(e, 'total weight')}
                  onBlur={e => selectRow(e, '')}
                  onChange={e => setInputs(e, 'total_weight')}
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
        <textarea
          type='text'
          name='current-notes'
          id='current-notes'
          className='flex-grow-1'
          onChange={e => setInputs(e, 'notes')}
          value={notes ? notes : ''}
        ></textarea>
      </section>
    </div>
  );
};

export default connect(null, { updateCurrentExerciseLog })(ExerciseForm);
