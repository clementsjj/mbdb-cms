import React, { Component } from 'react';
import axios from 'axios';
import { Button, Image, Container, Divider, Segment } from 'semantic-ui-react';
import LoginForm from './LoginForm.js';
import loading from '../assets/images/ajax-loader.gif';
import DataTable from './DataTable';
import AddBathroomForm from './AddBathroomForm';
import RegisterForm from './RegisterForm';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import '../App.css';

export default class Home extends Component {
  state = {
    loading: false,
    showLogin: false,
    showRegister: false,
    view: '',
    showAddBathroom: false,
    userCredentials: { username: '' }
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleAddBathroomButton = () => {
    if (this.state.showAddBathroom == true) {
      this.setState({ showAddBathroom: false });
    } else {
      this.setState({ showAddBathroom: true });
    }
  };

  handleGetAllData = () => {
    this.setState({ loading: true, showAddBathroom: false });
    let localaddress = `http://localhost:3000/bathrooms/getallbathrooms`;

    axios
      .get(localaddress)
      .then(data => {
        this.setState({
          bathrooms: data,
          loading: false,
          view: 'All Bathroom Data Points'
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~LOGIN DATA~~~~~~~~~~~~~~~~~~~~~~~~
  handleLoginData = data => {
    //console.log('From handleLoginData in Home.js: ', data);
    this.setState({ showLogin: false, userCredentials: data }, () => {
      //this.props.authUser = this.state.userCredentials;
      console.log('Login Credentials in State: ', this.state.userCredentials);
    });
  };
  //~~~~~~~~~~~~~~~~~~~~~~~~LOGIN DATA~~~~~~~~~~~~~~~~~~~~~~~~

  handleGetValidatedData = () => {
    this.setState({ loading: true, showAddBathroom: false });
    let localaddress = `http://localhost:3000/bathrooms/getvalidatedbathrooms`;
    let address = `https://secure-wave-30156.herokuapp.com/bathrooms/getallbathrooms`;
    axios
      .get(localaddress)
      .then(data => {
        console.log('ValidatedBathrooms: ', data);
        this.setState(
          {
            bathrooms: data,
            loading: false,
            view: 'All Validated Bathroom Data Points'
          },
          () => {
            console.log('Bathrooms-in-State: ', this.state.bathrooms);
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleGetNonValidatedData = () => {
    this.setState({ loading: true, showAddBathroom: false });
    let localaddress = `http://localhost:3000/bathrooms/getnonvalidatedbathrooms`;
    let address = `https://secure-wave-30156.herokuapp.com/bathrooms/getallbathrooms`;

    axios
      .get(localaddress)
      .then(data => {
        console.log('NonValidatedBathrooms: ', data);
        this.setState(
          {
            bathrooms: data,
            loading: false,
            view: 'All Validated Bathroom Data Points'
          },
          () => {
            console.log('Bathrooms-in-State: ', this.state.bathrooms);
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    this.setState({ userCredentials: { username: '' } });
  };

  handleTest = () => {
    console.log('testing');
  };

  componentDidMount = () => {
    console.log('Current User Credentials: = ', this.state.userCredentials);

    // Check for JWT token
    if (localStorage.jwtToken) {
      // Set auth token header auth
      setAuthToken(localStorage.jwtToken);
      // Decode token and get user info and exp
      const decoded = jwt_decode(localStorage.jwtToken);
      // Set user and isAuthenticated
      this.setState({ userCredentials: decoded });
      // Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Remove token from localStorage
        localStorage.removeItem('jwtToken');
        // Remove auth header for future requests
        setAuthToken(false);
      }
    }
  };
  render() {
    const { activeItem } = this.state;

    return (
      <div>
        {this.state.userCredentials.username != '' && (
          <div style={{ marginLeft: 20 }}>
            <p style={{ color: 'white' }}>
              Logged in as {this.state.userCredentials.username}
            </p>

            {this.state.userCredentials.isAdmin == true && (
              <p style={{ color: 'white' }}>
                <strong>Admin</strong>
              </p>
            )}
          </div>
        )}
        {this.state.userCredentials.isAdmin == false && (
          <p style={{ color: 'orange' }}>Not an Admin</p>
        )}

        <Container>
          {this.state.showLogin === false && this.state.showRegister === false && (
            <div>
              {this.state.userCredentials.username == '' ? (
                <Button
                  style={{ marginBottom: 2 }}
                  onClick={() => this.setState({ showLogin: true })}
                >
                  Login...
                </Button>
              ) : (
                <Button
                  style={{
                    marginBottom: 2,
                    backgroundColor: '#0e0487',
                    color: 'white'
                  }}
                  onClick={this.handleLogout}
                >
                  Logout
                </Button>
              )}
              <Button onClick={() => this.setState({ showRegister: true })}>
                Register...
              </Button>
            </div>
          )}

          {/* ~~~~~~~~~~~~~~~~~~~~~~~~LOGIN FORM~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~LOGIN FORM~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~LOGIN FORM~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {this.state.showLogin === true && (
            <div>
              <LoginForm
                onLogin={data => {
                  this.handleLoginData(data);
                }}
                hide={() => {
                  this.setState({ showLogin: false, view: 'login' });
                  setTimeout(() => this.setState({ view: '' }), 2000);
                }}
              />
              <Button onClick={() => this.setState({ showLogin: false })}>
                Cancel
              </Button>
            </div>
          )}

          {this.state.showRegister === true ? (
            <div>
              <RegisterForm
                hide={() => {
                  this.setState({ showRegister: false, view: 'register' });
                  setTimeout(() => this.setState({ view: '' }), 2000);
                }}
              />

              <Button onClick={() => this.setState({ showRegister: false })}>
                Cancel
              </Button>
            </div>
          ) : (
            ''
          )}
          {this.state.view == 'login' && (
            <p style={{ color: 'orange' }}>Logging In...</p>
          )}
          {this.state.view === 'register' && (
            <p style={{ color: 'green' }}>Registration Submitted</p>
          )}
        </Container>
        <br />
        <Divider />
        <br />
        <Container>
          <div>
            <Button
              onClick={this.handleGetValidatedData}
              style={{ marginBottom: 5 }}
            >
              Get Validated Bathroom Points
            </Button>
            <Button onClick={this.handleGetNonValidatedData}>
              Get <span style={{ color: 'purple' }}>Non-</span>
              Validated Bathroom Points
            </Button>
            &nbsp;
            <Button
              onClick={this.handleGetAllData}
              style={{ backgroundColor: 'purple' }}
            >
              Get All Data Points
            </Button>
            &nbsp;
            <Button
              onClick={this.handleAddBathroomButton}
              style={{ backgroundColor: 'green' }}
            >
              Add Bathroom
            </Button>
          </div>
          {this.state.loading === true && (
            <div>
              <br />
              <Image src={loading} />
            </div>
          )}
          <br />
          {this.state.showAddBathroom != false && (
            <div>
              <br />
              <AddBathroomForm />
            </div>
          )}
          {this.state.view !== '' && (
            <h3 style={{ color: 'white' }}>{this.state.view}</h3>
          )}
          <DataTable
            isAdmin={this.state.userCredentials.isAdmin}
            data={this.state.bathrooms}
            action={this.handleGetValidatedData}
          />
        </Container>
      </div>
    );
  }
}
