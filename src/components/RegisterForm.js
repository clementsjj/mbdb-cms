import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import '../App.css';
import Axios from 'axios';

export default class RegisterForm extends Component {
  state = {
    response: '',
    userData: {
      username: '',
      password: '',
      password2: ''
    }
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

  handleRegister = () => {
    console.log('Submitting new User: ', this.state.userData);
    let address = `http://localhost:3000/users/register`;
    let userToAdd = this.state.userData;
    this.props.hide();
    this.setState({
      userData: { username: '', password: '', password2: '' },
      response: ''
    });
    Axios.post(address, userToAdd)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        {/* <input placeholder="Email" /> */}
        {/* <br /> */}
        <input
          name="username"
          placeholder="Username"
          value={this.state.userData.username}
          onChange={this.handleInputChange}
        />
        <br />
        <input
          name="password"
          placeholder="Password"
          value={this.state.userData.password}
          onChange={this.handleInputChange}
        />
        <br />
        <input
          name="password2"
          placeholder="Password Again"
          value={this.state.userData.password2}
          onChange={this.handleInputChange}
        />
        <br />
        <Button
          style={{ backgroundColor: 'green' }}
          onClick={this.handleRegister}
        >
          Register
        </Button>
      </div>
    );
  }
}
