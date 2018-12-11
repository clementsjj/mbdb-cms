import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

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
    this.setState({
      userData: { username: '', password: '' }
    });
    Axios.post(address, userToLogin)
      .then(res => {
        const { token } = res.data;
        //console.log('Token: ', token);
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        //console.log('Decoded Token: ', decoded);
        this.props.onLogin(decoded);
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
