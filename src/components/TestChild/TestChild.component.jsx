import React from 'react';
import './TestChild.styles.scss';

class TestChild extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      name: this.props.name,
    };
  }

  onChange = e => {
    console.log(e.target.value);
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div>
        <input type='text' name='name' id='' value={this.state.name} onChange={this.onChange} />
      </div>
    );
  }
}

export default TestChild;
