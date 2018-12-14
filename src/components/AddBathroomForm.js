import React, { Component } from 'react';
import {
  Button,
  Header,
  Icon,
  Container,
  Grid,
  Menu,
  Divider,
  Image
} from 'semantic-ui-react';
import axios from 'axios';
import loading from '../assets/images/ajax-loader.gif';

//const apikey = 'AIzaSyAbFlH5i12gn57-9R-1sKrZA9z_ojn1lwA';
//let placesToMap = null;

class AddBathroomForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      receivedPlace: {},
      inputQuery: '',
      newBathroom: {
        name: '',
        address: '',
        lat: '',
        lng: '',
        code: '',
        isPublic: ''
      },
      placesResult: null,
      activeItem: 6,
      selectedAddress: null,
      placeRequest: {
        query: '',
        fields: [
          'address_component',
          'adr_address',
          'formatted_address',
          'name',
          'type',
          'vicinity'
        ],
        locationBias: { radius: 1000, center: { lat: 40.7308, lng: -73.9973 } }
      },
      status: '',
      loading: false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handlePlaceSearch = this.handlePlaceSearch.bind(this);
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.handleInputQuery = this.handleInputQuery.bind(this);
  }

  /* This life cycle hook gets executed when the component mounts */

  handlePlaceSearch(e) {
    e.preventDefault();
    this.setState({ placesResult: null, loading: true });
    let query = this.state.inputQuery;
    console.log(`Handle Place Search... with query of: ${query}`);
    axios
      .get(
        `https://secure-wave-30156.herokuapp.com/bathrooms/placesearch?query=${query}`
      )
      .then(place => {
        console.log('PlaceSearch returned = ', place.data);
        let locationArray = place.data.slice(0, 5).map(item => {
          return JSON.stringify(item);
        });
        console.log('LocationArray: ', locationArray);
        //placesToMap = locationArray;
        //console.log('PlacesToMap: ', placesToMap);

        this.setState({ placesResult: locationArray, loading: false }, () => {
          console.log(
            'setState. this.state.placesResult= ',
            this.state.placesResult
          );
        });
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newBathroom: {
        name: '',
        address: '',
        code: ''
      },
      selectedAddress: null,
      placesResult: null,
      inputQuery: ''
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let address = `https://mbdb-node.herokuapp.com/bathrooms/addbathroom`;
    //let addressTwo = `http://localhost:3000/bathrooms/addbathroom`;
    let bathroomToAdd = this.state.newBathroom;

    axios
      .post(address, bathroomToAdd)
      .then(res => {
        this.setState(
          {
            status: 'success',
            selectedAddress: null,
            placesResult: null,
            inputQuery: ''
          },
          () => {
            setTimeout(() => this.setState({ status: '' }), 5000);
          }
        );

        console.log('Success!!!!');

        setTimeout(() => {
          console.log('After Submitted State: ', this.state);
        }, 100);
      })
      .catch(err => {
        this.setState(
          {
            status: 'failure',
            selectedAddress: null,
            placesResult: null,
            inputQuery: ''
          },
          () => {
            setTimeout(() => this.setState({ status: '' }), 3000);
          }
        );

        console.log('Failure.');
      });
  }

  handleInputQuery(e) {
    console.log(e.target.value);
    let value = e.target.value;
    this.setState({ inputQuery: value }, () => {
      console.log('inputQuery: ', this.state.inputQuery);
    });
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        newBathroom: {
          ...prevState.newBathroom,
          [name]: value
        }
      }),
      () =>
        console.log(
          'newBathroom Value (from FormContainer): ',
          this.state.newBathroom
        )
    );
  }

  handleAddressSelect(e, { name, value }) {
    this.setState({ activeItem: name });

    let parsedJSON = JSON.parse(value);
    let newObject = {
      test: parsedJSON
    };
    let placeID = newObject.test.place_id;
    let lat = newObject.test.geometry.location.lat;
    let lng = newObject.test.geometry.location.lng;

    this.setState({
      selectedAddress: JSON.parse(value),
      newBathroom: {
        address: newObject.test.formatted_address,
        lat: lat,
        lng: lng,
        place_id: placeID
      }
    });
    setTimeout(() => {
      console.log('Current selected address: ', this.state.selectedAddress);
    }, 50);
  }
  componentDidMount() {
    console.log('Component-Did-Mount State: ', this.state);
  }

  render() {
    return (
      <div>
        <Grid stackable padded={false}>
          <Grid.Row centered columns={2} verticalAlign="middle">
            <Grid.Column>
              <form className="container" onSubmit={this.handleFormSubmit}>
                <Container style={{ border: '2px solid green' }}>
                  <input
                    placeholder="Bathroom Query"
                    name="inputQuery"
                    style={{ margin: 5 }}
                    value={this.state.inputQuery}
                    onChange={this.handleInputQuery}
                  />
                  <Button
                    size="tiny"
                    basic
                    color="blue"
                    style={{ marginTop: 5, marginBottom: 5 }}
                    disabled={this.state.newBathroom.address ? false : false}
                    onClick={this.handlePlaceSearch}
                  >
                    Search for Place
                  </Button>

                  {this.state.loading && (
                    <div>
                      <br />
                      <Image src={loading} />
                    </div>
                  )}

                  {this.state.status === 'success' && (
                    <div
                      style={{ textAlign: 'center', backgroundColor: 'green' }}
                    >
                      <p style={{ color: 'white', fontWeight: 900 }}>
                        Successfully sent to moderator for approval!
                      </p>
                      <p style={{ color: 'white' }}>
                        Thank you for your contribution!
                      </p>
                      <p style={{ color: 'white' }}>
                        Your fellow citizens thank you as well.
                      </p>
                    </div>
                  )}

                  {this.state.status === 'failure' && (
                    <div
                      style={{ textAlign: 'center', backgroundColor: 'red' }}
                    >
                      <p style={{ color: 'white', fontWeight: 900 }}>
                        Error! Sorry. :(
                      </p>
                      <p style={{ color: 'white' }}>
                        Please contact the site administrator.
                      </p>
                    </div>
                  )}

                  {this.state.placesResult !== null && (
                    <Menu vertical inverted>
                      {this.state.placesResult.map((item, i) => {
                        let objItem = JSON.parse(item);
                        let stringI = i + '';
                        return (
                          <div key={stringI}>
                            <Menu.Item
                              name={stringI}
                              active={this.state.activeItem === stringI}
                              value={item}
                              onClick={this.handleAddressSelect}
                            >
                              <Header as="h4" style={{ color: 'white' }}>
                                {objItem.name}
                              </Header>
                              {objItem.formatted_address}
                            </Menu.Item>
                          </div>
                        );
                      })}
                    </Menu>
                  )}
                </Container>

                <br />
              </form>
            </Grid.Column>
            {this.state.selectedAddress !== null && (
              <Grid.Column>
                <Container
                  style={{
                    border: '2px solid green',
                    color: 'white'
                  }}
                >
                  <FinalFormInput data={this.state} />
                  {/* <NameInput submit={this.handleNameINput} /> */}
                  <Container>
                    <input
                      placeholder="Name"
                      style={{ margin: 5 }}
                      name="name"
                      value={this.state.newBathroom.name}
                      onChange={this.handleInput.bind(this)}
                    />
                    <p>What shall we name this bathroom?</p>
                  </Container>
                  <br />
                  <Container>
                    <input
                      placeholder="Description"
                      style={{ margin: 5 }}
                      name="description"
                      value={this.state.newBathroom.description}
                      onChange={this.handleInput.bind(this)}
                    />
                    <p>Enter a description, directions, whatever. Or not.</p>
                  </Container>
                  <br />
                  <Container>
                    <input
                      placeholder="Bathroom Code"
                      name="code"
                      style={{ margin: 5 }}
                      value={this.state.newBathroom.code}
                      onChange={this.handleInput}
                    />
                    <p>What is the bathroom code/pin?</p>
                  </Container>
                  <br />
                  <Container>
                    <input
                      name="isPublic"
                      type="radio"
                      value="true"
                      onChange={this.handleInput}
                    />{' '}
                    Public &nbsp;&nbsp;
                    <input
                      name="isPublic"
                      type="radio"
                      value="false"
                      checked
                      onChange={this.handleInput}
                    />{' '}
                    Private
                  </Container>
                  <br />
                  <Container>
                    Quality:{'  '}
                    <input
                      name="quaity"
                      type="radio"
                      value="1"
                      onChange={this.handleInput}
                    />{' '}
                    1{'  '}&nbsp;
                    <input
                      name="quaity"
                      type="radio"
                      value="2"
                      onChange={this.handleInput}
                    />{' '}
                    2{'  '}&nbsp;
                    <input
                      name="quaity"
                      type="radio"
                      value="3"
                      checked
                      onChange={this.handleInput}
                    />{' '}
                    3{'  '}&nbsp;
                    <input
                      name="quaity"
                      type="radio"
                      value="4"
                      onChange={this.handleInput}
                    />{' '}
                    4{'  '}&nbsp;
                    <input
                      name="quaity"
                      type="radio"
                      value="5"
                      onChange={this.handleInput}
                    />{' '}
                    5{'  '}
                  </Container>
                  <br />
                  <Button
                    color="green"
                    inverted
                    onClick={this.handleFormSubmit}
                    disabled={
                      this.state.newBathroom.name ||
                      this.state.newBathroom.address ||
                      this.state.newBathroom.code
                        ? false
                        : true
                    }
                  >
                    <Icon name="checkmark" />
                    Submit
                  </Button>
                  {'     '}
                  <Button
                    color="red"
                    inverted
                    onClick={this.handleClearForm}
                    disabled={
                      this.state.newBathroom.name ||
                      this.state.newBathroom.address ||
                      this.state.newBathroom.code
                        ? false
                        : true
                    }
                  >
                    Clear Form
                  </Button>
                </Container>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

function FinalFormInput(props) {
  return (
    <Container>
      <h4>Selected Location:</h4>
      <p>{props.data.selectedAddress.name}</p>
      <p>
        {props.data.selectedAddress.geometry.location.lat} |{' '}
        {props.data.selectedAddress.geometry.location.lng}
      </p>
      <Divider />
    </Container>
  );
}

export default AddBathroomForm;
