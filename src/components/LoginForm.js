import React, { Component } from 'react';
// import { Button, Modal, Header, Icon, Container } from 'semantic-ui-react';
import '../App.css';

export default class Home extends Component {
  state = {};

  render() {
    return (
      <div>
        <input placeholder="Username" />
        <br />
        <input placeholder="Password" />
      </div>
    );
  }
}
