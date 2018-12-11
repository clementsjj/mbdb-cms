import React, { Component } from 'react';
import axios from 'axios';
import { Button, Image, Container, Divider } from 'semantic-ui-react';
import LoginForm from './LoginForm.js';
import loading from '../assets/images/ajax-loader.gif';
import DataTable from './DataTable';
import AddBathroomForm from './AddBathroomForm';
import '../App.css';

export default class Home extends Component {
  state = {
    loading: false,
    showLogin: false,
    showRegister: false,
    view: '',
    showAddBathroom: false
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  handleLogin = () => {
    console.log('Handle Login');
  };

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

  handleTest = () => {
    console.log('testing');
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Container>
          {this.state.showLogin === false && this.state.showRegister === false && (
            <div>
              <Button onClick={() => this.setState({ showLogin: true })}>
                Login...
              </Button>
              <br />
              <br />
              <Button onClick={() => this.setState({ showRegister: true })}>
                Register...
              </Button>
            </div>
          )}

          {this.state.showLogin === true && (
            <div>
              <LoginForm />
              <Button onClick={this.handleLogin}>Login</Button>
              <Button onClick={() => this.setState({ showLogin: false })}>
                Cancel
              </Button>
            </div>
          )}

          {this.state.showRegister === true ? (
            <div>
              <input placeholder="Enter Username" />
              <br />
              <Button onClick={() => this.setState({ showRegister: false })}>
                Cancel
              </Button>
            </div>
          ) : (
            ''
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
            <Button>
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
            data={this.state.bathrooms}
            action={this.handleGetValidatedData}
          />
        </Container>
      </div>
    );
  }
}
