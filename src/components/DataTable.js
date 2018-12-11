import React, { Component } from 'react';
import DataModal from './DataModal';
import { Button, Table, Divider } from 'semantic-ui-react';
import '../App.css';
import axios from 'axios';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      isModalShown: false,
      editBathroom: {},
      info: [],
      activeEdit: ''
    };
    //   componentDidMount() {
    //     const { data } = this.props;
    //     let newObject = {
    //       test: data
    //     };

    //     console.log('Data Recieved By DATATABLE: ', newObject);
    //   }
    this.handleEditButton = this.handleEditButton.bind(this);
  }
  handleEditButton = (e, { name, value }) => {
    // if(this.state.activeEdit == {name}){
    //   this.setState({activeEdit:''})
    // }

    if (this.state.activeEdit == name) {
      this.setState({ activeEdit: '' });
    }
    if (this.state.activeEdit !== name) {
      this.setState({ activeEdit: name, editBathroom: value }, () =>
        console.log('bathroom to edit = ', this.state.editBathroom)
      );
    } else {
      this.setState({ activeEdit: '' });
    }
  };

  handleSaveButton = e => {
    let address = `http://localhost:3000/bathrooms/editbathroom`;
    let bathroom = Object.assign({}, this.state.editBathroom);
    console.log('~~Save Clicked~~ --New Value----Send to DB-- ', bathroom);
    let infoCopy = Object.assign([], this.state.info);

    for (let i = 0; i < this.state.info.length; i++) {
      if (bathroom._id == this.state.info[i]._id) {
        let bathroomToChange = Object.assign({}, this.state.info[i]);
        infoCopy.splice(i, 1, bathroom);
        this.setState({ info: infoCopy });
      }
    }

    axios
      .put(address, bathroom)
      .then(res => {
        console.log('Success');
        //this.setState({ info: infoCopy });
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      isModalShown: false,
      status: 'Submit',
      editBathroom: {},
      activeEdit: ''
    });

    setTimeout(() => {
      this.setState({ status: '' });
    }, 2000);
  };

  handleCancelButton = () => {
    this.setState({ activeEdit: '', editBathroom: {} });
  };

  handleInputChange = e => {
    //e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState(
      prevState => ({
        editBathroom: {
          ...prevState.editBathroom,
          [name]: value
        }
      }),
      () => console.log('editBathroom Value : ', this.state.editBathroom)
    );
  };

  componentDidMount() {
    if (this.state.info.length >= 1) {
      return;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        info: this.props.data.data
      });
    }
  }

  render() {
    // const { data } = this.props;
    // let newObject = {
    //   test: datas)thth
    // };
    // console.log('this.state.info: ', this.state.info);
    return (
      <div>
        {this.state.activeEdit !== '' && (
          <p style={{ color: 'red' }}>
            <span>
              <strong>Warning: </strong>
            </span>
            Clicking "Edit" on another row before saving will discard any
            changes by default
          </p>
        )}
        {this.state.status == 'Submit' && (
          <h3
            style={{
              color: 'white',
              backgroundColor: 'green',
              textAlign: 'center'
            }}
          >
            Successfully Submitted Updates
          </h3>
        )}
        {this.state.isModalShown === true && (
          <DataModal bathroom={this.state.editBathroom} isShown={true} />
        )}

        {this.state.info.length < 1 ? (
          ''
        ) : (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Lat</Table.HeaderCell>
                <Table.HeaderCell>Lng</Table.HeaderCell>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>isPublic?</Table.HeaderCell>
                <Table.HeaderCell>Quality</Table.HeaderCell>
                <Table.HeaderCell>isValidated?</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.info.map((bathroom, i) => {
                return (
                  <Table.Row
                    key={i}
                    style={
                      this.state.activeEdit === bathroom.place_id
                        ? { backgroundColor: '#ff99ff' }
                        : { backgroundColor: '#fff' }
                    }
                  >
                    <Table.Cell>
                      {
                        <React.Fragment>
                          {/* Two Buttons, Edit and Save, only one shown at a time */}
                          <Button
                            size="tiny"
                            compact
                            // active={this.state.activeEdit === bathroom.place_id}
                            name={bathroom.place_id}
                            value={bathroom}
                            color="yellow"
                            style={
                              this.state.activeEdit === bathroom.place_id
                                ? { display: 'none' }
                                : { display: 'block' }
                            }
                            onClick={this.handleEditButton}
                          >
                            Edit
                          </Button>
                          <Button
                            style={
                              this.state.activeEdit === bathroom.place_id
                                ? { display: 'block' }
                                : { display: 'none' }
                            }
                            size="small"
                            color="green"
                            onClick={this.handleSaveButton}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            color="yellow"
                            onClick={this.handleCancelButton}
                            style={
                              this.state.activeEdit === bathroom.place_id
                                ? { display: 'block' }
                                : { display: 'none' }
                            }
                          >
                            Cancel
                          </Button>
                          <Divider
                            style={
                              this.state.activeEdit === bathroom.place_id
                                ? { display: 'block' }
                                : { display: 'none' }
                            }
                          />
                          <Button
                            color="red"
                            size="mini"
                            style={
                              this.state.activeEdit === bathroom.place_id
                                ? { display: 'block' }
                                : { display: 'none' }
                            }
                          >
                            Delete
                          </Button>
                        </React.Fragment>
                      }
                    </Table.Cell>
                    {this.state.activeEdit === bathroom.place_id ? (
                      <React.Fragment>
                        <Table.Cell>
                          <input
                            name="name"
                            onChange={this.handleInputChange}
                            value={this.state.editBathroom.name}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {<input value={this.state.editBathroom.lat} />}
                        </Table.Cell>
                        <Table.Cell>
                          {<input value={this.state.editBathroom.lng} />}
                        </Table.Cell>
                        <Table.Cell>
                          {<input value={this.state.editBathroom.code} />}
                        </Table.Cell>
                        <Table.Cell>
                          {/* {this.state.editBathroom.isPublic ? 'Yes' : 'No'} */}
                        </Table.Cell>
                        <Table.Cell>
                          {<input value={this.state.editBathroom.quality} />}
                        </Table.Cell>

                        <Table.Cell>
                          <form onChange={this.handleInputChange} focused>
                            <input
                              type="radio"
                              defaultValue={true}
                              name="isValidated"
                              // onChange={() => {
                              //   this.setState(
                              //     {
                              //       editBathroom: { isValidated: true }
                              //     },
                              //     () => console.log(this.state.editBathroom)
                              //   );
                              // }}
                              defaultChecked={
                                this.state.editBathroom.isValidated
                                  ? true
                                  : false
                              }
                            />{' '}
                            Yes
                            <br />
                            <input
                              type="radio"
                              name="isValidated"
                              defaultValue={false}
                              // onChange={() => {
                              //   this.setState(
                              //     {
                              //       editBathroom: { isValidated: false }
                              //     },
                              //     () => console.log(this.state.editBathroom)
                              //   );
                              // }}
                              defaultChecked={
                                this.state.editBathroom.isValidated
                                  ? false
                                  : true
                              }
                            />{' '}
                            No
                            {/* {this.state.editBathroom.isValidated ? 'Yes' : 'No'} */}
                          </form>
                        </Table.Cell>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Table.Cell>{bathroom.name}</Table.Cell>
                        <Table.Cell>{bathroom.lat}</Table.Cell>
                        <Table.Cell>{bathroom.lng}</Table.Cell>
                        <Table.Cell>{bathroom.code}</Table.Cell>
                        <Table.Cell>
                          {bathroom.isPublic ? 'Yes' : 'No'}
                        </Table.Cell>
                        <Table.Cell>{bathroom.quality}</Table.Cell>
                        <Table.Cell
                          style={
                            !bathroom.isValidated
                              ? {
                                  backgroundColor: '#ffff66'
                                }
                              : { backgroundColor: 'none' }
                          }
                        >
                          {bathroom.isValidated ? 'Yes' : 'No'}
                        </Table.Cell>
                      </React.Fragment>
                    )}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </div>
    );
  }
}
