import React, { Component } from 'react';
import './App.css';
import carddata from './cards.json';

class App extends Component {
  render() {
    return (
      <div className="App">
          <p>
            Now with data for {carddata.length} cards!
          </p>
      </div>
    );
  }
}

export default App;
