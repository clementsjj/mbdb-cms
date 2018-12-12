import React, { Component } from 'react';
import DataModal from './DataModal';
import { Button, Table, Divider, Icon } from 'semantic-ui-react';
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
      activeEdit: '',
      codeToAdd: ''
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

  deleteCode = (value, key) => {
    let address = `http://localhost:3000/bathrooms/removecode`;
    let payload = {};
    payload._id = this.state.editBathroom._id;
    payload.value = value;
    payload.i = key;
    console.log('Delete Code: ', payload);

    axios
      .put(address, payload)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  handleAddCodeInput = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => ({
      [name]: value
    }));
  };

  handleAddCodeSubmit = () => {
    let address = `http://localhost:3000/bathrooms/addadditionalcode`;
    let codes = this.state.codeToAdd;
    let payload = { codes: codes, _id: this.state.editBathroom._id };

    axios
      .put(address, payload)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

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

  handleDeleteButton = e => {
    console.log('Deleting ', this.state.editBathroom);
    let address = `http://localhost:3000/bathrooms/deletebathroom`;
    let bathroom = Object.assign({}, this.state.editBathroom);
    let infoCopy = Object.assign([], this.state.info);

    for (let i = 0; i < this.state.info.length; i++) {
      if (bathroom._id == this.state.info[i]._id) {
        //let bathroomToDelete = Object.assign({}, this.state.info[i]);
        infoCopy.splice(i, 1);
        this.setState({ info: infoCopy });
      }
    }
    axios
      .delete(address, bathroom)
      .then(res => {
        console.log('res - ', res);
        console.log('Successfully Deleted');
      })
      .catch(err => {
        console.log('Delete Error: ', err);
      });

    this.setState({
      isModalShown: false,
      status: 'Delete',
      editBathroom: {},
      activeEdit: ''
    });

    setTimeout(() => {
      this.setState({ status: '' });
    }, 2000);
  };

  handleCodeArrayChange = e => {
    let name = e.target.name;
    let value = e.target.value;

    console.log('Name: ', name);
    console.log('Value: ', value);

    //let otherCodesCopy = Object.assign({}, this.state.editBathroom.otherCodes);
    let otherCodesCopy = this.state.editBathroom.otherCodes;
    otherCodesCopy[name] = value;

    this.forceUpdate();

    //console.log('otherCodesCopy[name]: ', otherCodesCopy[name]);

    // this.setState(prevState => ({
    //   editBathroom: {
    //     otherCodes: [value]
    //   }
    // }));
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
        {this.state.status == 'Delete' && (
          <h3
            style={{
              color: 'white',
              backgroundColor: 'green',
              textAlign: 'center'
            }}
          >
            Successfully Deleted Record
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
                            disabled={this.props.isAdmin == true ? false : true}
                            size="tiny"
                            compact
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
                            onClick={this.handleDeleteButton}
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
                          {
                            <div>
                              <input
                                onChange={this.handleInputChange}
                                value={this.state.editBathroom.code}
                              />
                              <Divider />
                              Other Codes:
                              {this.state.editBathroom.otherCodes.map(
                                (code, i) => (
                                  <div style={{ display: 'flex' }}>
                                    <input
                                      //style={{ display: 'inline-block' }}
                                      key={i}
                                      name={i}
                                      onChange={this.handleCodeArrayChange}
                                      value={
                                        this.state.editBathroom.otherCodes[i]
                                      }
                                    />
                                    <Icon
                                      //style={{ display: 'inline-block' }}
                                      value={
                                        this.state.editBathroom.otherCodes[i]
                                      }
                                      key={i}
                                      name="trash alternate"
                                      onClick={this.deleteCode.bind(
                                        this,
                                        this.state.editBathroom.otherCodes[i],
                                        i
                                      )}
                                    />
                                  </div>
                                )
                              )}
                              <Divider />
                              <input
                                name="codeToAdd"
                                onChange={this.handleAddCodeInput}
                                value={this.state.codeToAdd}
                                placeholder="Code To Add"
                              />
                              <Button
                                disabled={
                                  this.state.codeToAdd != '' ? false : true
                                }
                                size="mini"
                                onClick={this.handleAddCodeSubmit}
                                style={{ backgroundColor: 'yellow' }}
                              >
                                Add Code(s)
                              </Button>
                            </div>
                          }
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
