import React from 'react';
import './TestPage.styles.scss';

import TestChild from '../../components/TestChild/TestChild.component';

class TestPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      character: null,
    };
  }

  async getData(id) {
    if (!id) id = 1;
    let response = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
      method: 'GET',
    });
    let character = await response.json();
    this.setState({ character }, () => console.log(this.state));
  }

  changeCharacter = () => {
    let newId = this.state.character.id + 1;
    this.setState({ character: null }, () => this.getData(newId));
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    let { character } = this.state;
    return (
      <div>
        {character ? <TestChild name={character.name} /> : <div>Loading...</div>}
        <button onClick={this.changeCharacter}>Change Character</button>
      </div>
    );
  }
}

export default TestPage;
