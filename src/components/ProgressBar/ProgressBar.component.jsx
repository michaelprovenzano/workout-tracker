import React from 'react';
import './ProgressBar.styles.scss';

class ProgressBar extends React.Component {
  render() {
    const { progress, classes } = this.props;

    return (
      <div className={`progress-bar ${classes}`}>
        <div className='progress' style={{ width: `${progress}%` }}></div>
      </div>
    );
  }
}

export default ProgressBar;
