import React from 'react';
import './ProgressRing.styles.scss';

class ProgressRing extends React.Component {
  constructor(props) {
    super(props);

    const { radius, stroke } = this.props;

    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  render() {
    const { radius, stroke, progress } = this.props;
    const strokeDashoffset = this.circumference - (progress / 100) * this.circumference;

    return (
      <div className='progress-ring'>
        <h2>{progress}%</h2>
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke='#196CFF'
            fill='transparent'
            strokeWidth={stroke}
            strokeDasharray={this.circumference + ' ' + this.circumference}
            style={{ strokeDashoffset }}
            r={this.normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke='#E4E4E4'
            fill='transparent'
            strokeWidth={stroke}
            strokeDasharray={this.circumference + ' ' + this.circumference}
            r={this.normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
      </div>
    );
  }
}

export default ProgressRing;
