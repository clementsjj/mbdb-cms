import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Axios from 'axios';

import '../App.css';

export default class LoginForm extends Component {
  state = {
    userData: {
      username: '',
      password: ''
    }
  };

  handleLogin = () => {
    let address = `http://localhost:3000/users/login`;
    let userToLogin = Object.assign({}, this.state.userData);
    console.log('userToLogin: ', userToLogin);
    //this.props.hide();
    this.setState({
      userData: { username: '', password: '' }
    });
    Axios.post(address, userToLogin)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = e => {
    let value = e.target.value;
    let name = e.target.name;

    this.setState(
      prevState => ({
        userData: {
          ...prevState.userData,
          [name]: value
        }
      }),
      () => console.log(this.state.userData)
    );
  };

  render() {
    return (
      <div>
        <input
          name="username"
          value={this.state.userData.username}
          onChange={this.handleInputChange}
          placeholder="Username"
        />
        <br />
        <input
          name="password"
          value={this.state.userData.password}
          onChange={this.handleInputChange}
          placeholder="Password"
        />
        <br />
        <Button style={{ backgroundColor: 'green' }} onClick={this.handleLogin}>
          Login
        </Button>
      </div>
    );
  }
}
