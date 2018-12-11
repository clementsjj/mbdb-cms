import React, { Component } from 'react';
import Home from './components/Home';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="App-header">Welcome to the MBDB CMS</div>
        <Home />
      </div>
    );
  }
}

export default App;
