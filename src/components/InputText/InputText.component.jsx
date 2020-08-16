import React from 'react';
import './InputText.styles.scss';

class InputText extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  toggleActive = e => {
    if (e.target.value === '') e.target.classList.toggle('active');
  };

  render() {
    let { name, type, label, className, onInput } = this.props;
    if (!className) className = '';
    return (
      <div className={`input-group ${className}`}>
        <input
          type={type}
          name={name}
          id={name}
          onFocus={this.toggleActive}
          onBlur={this.toggleActive}
          onInput={onInput}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    );
  }
}

export default InputText;
