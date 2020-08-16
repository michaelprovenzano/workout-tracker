import React from 'react';
import './ExerciseForm.styles.scss';

class ExerciseForm extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      selected: '',
      weight: props.weight,
      reps: props.reps,
      weightLeft: props.weightLeft,
      weightRight: props.weightRight,
      repsLeft: props.repsLeft,
      repsRight: props.repsRight,
    };
  }

  selectRow = (e, selected) => {
    this.setState({ selected: selected });
  };

  render() {
    let { className } = this.props;
    let { selected } = this.state;

    return (
      <div className={`exercise-form p-0 ${className}`}>
        <section className='row'>
          <div className='col-3 p-0'>
            <span className='label d-flex justify-content-center align-items-center'>Left</span>
          </div>
          <div className='details col-9 p-0'>
            <div className={`row ${selected === 'left reps' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Reps</div>
              <div className='col-4 p-0 d-flex align-items-center'>8 reps</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='text'
                  name='current-reps'
                  id='current-reps'
                  className='w-100'
                  onClick={e => this.selectRow(e, 'left reps')}
                  onBlur={e => this.selectRow(e, '')}
                />
              </div>
            </div>
            <div className={`row ${selected === 'left weight' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
              <div className='col-4 p-0 d-flex align-items-center'>20 lbs</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='text'
                  name='current-weight'
                  id='current-weight'
                  className='w-100'
                  onClick={e => this.selectRow(e, 'left weight')}
                  onBlur={e => this.selectRow(e, '')}
                />
              </div>
            </div>
          </div>
        </section>
        <section className='row'>
          <div className='col-3 p-0'>
            <span className='label d-flex justify-content-center align-items-center'>Right</span>
          </div>
          <div className='details col-9 p-0'>
            <div className={`row ${selected === 'right reps' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Reps</div>
              <div className='col-4 p-0 d-flex align-items-center'>8 reps</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='text'
                  name='current-reps'
                  id='current-reps'
                  className='w-100'
                  onClick={e => this.selectRow(e, 'right reps')}
                  onBlur={e => this.selectRow(e, '')}
                />
              </div>
            </div>
            <div className={`row ${selected === 'right weight' ? 'selected' : ''}`}>
              <div className='col-4 p-0 d-flex align-items-center bold'>Weight</div>
              <div className='col-4 p-0 d-flex align-items-center'>20 lbs</div>
              <div className='col-4 p-0 d-flex align-items-center'>
                <input
                  type='text'
                  name='current-weight'
                  id='current-weight'
                  className='w-100'
                  onClick={e => this.selectRow(e, 'right weight')}
                  onBlur={e => this.selectRow(e, '')}
                />
              </div>
            </div>
          </div>
        </section>
        <section className='d-flex w-100 current-notes'>
          <div>
            <span className='label d-flex justify-content-center align-items-center'>Notes</span>
          </div>
          <input type='text' name='current-notes' id='current-notes' className='flex-grow-1' />
        </section>
      </div>
    );
  }
}

export default ExerciseForm;
