import React, { Component } from 'react';
import Home from './components/Home';
import './App.css';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

class App extends Component {
  //check if Jwt exist if it does set the current user state and pass it as props
  constructor(props) {
    super(props);

    this.state = { authUser: null };
  }

  componentDidMount() {
    // // Check for JWT token
    // if (localStorage.jwtToken) {
    //   // Set auth token header auth
    //   setAuthToken(localStorage.jwtToken);
    //   // Decode token and get user info and exp
    //   const decoded = jwt_decode(localStorage.jwtToken);
    //   console.log('decoded = ', decoded);
    //   // Set user and isAuthenticated
    //   this.setState({ authUser: decoded });
    //   // Check for expired token
    //   const currentTime = Date.now() / 1000;
    //   if (decoded.exp < currentTime) {
    //     // Remove token from localStorage
    //     localStorage.removeItem('jwtToken');
    //     // Remove auth header for future requests
    //     setAuthToken(false);
    //   }
    // }
  }

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
