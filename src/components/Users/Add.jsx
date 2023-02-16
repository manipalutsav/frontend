import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import reducer from "../../reducers/commonReducer";
import { create } from "../../services/userServices";
import { Input, Button } from "../../commons/Form";
import constants from "../../utils/constants";
import { getAll } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";

export default class AddUser extends React.Component {

  types = (function () {
    let options = [];

    for (let userType in constants.USER_TYPES) {
      if (constants.USER_TYPES.hasOwnProperty(userType)) {
        options.push({
          label: userType.replace(/_/g, " "),
          value: constants.USER_TYPES[userType],
        });
      }
    }

    return options;
  }());
  ADD_USER = "Add User";
  ADDING_USER = "Adding User...";
  state = {

    buttonText: this.ADD_USER
  };

  handleChange = (e) => {
    this.setState({ [e.name]: e.value });
  };

  handleClick = () => {
    if (!this.state.name)
      return toast("Please enter name");
    if (!this.state.email)
      return toast("Please enter email id");
    if (!this.state.password)
      return toast("Please enter password");
    if (!this.state.college)
      return toast("Please select college");
    if (!this.state.type)
      return toast("Please select user type");

    this.setState({
      buttonText: this.ADDING_USER
    }, async () => {
      let response = await create({
        name: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        password: this.state.password,
        college: this.state.college,
        type: this.state.type,
      });
      if (!response)
        toast("Some error occured");
      else if (response.status === 200)
        return navigate("/users");
      else
        toast(response.message);
      this.setState({ buttonText: this.ADD_USER })
    })
  };

  componentWillMount() {
    getAll();

    reducer.subscribe(() => {
      reducer.getState().then(state => {
        this.setState({
          colleges: state.data.list.map(college => ({
            value: college.id,
            label: college.name + ", " + college.location,
          })),
        });
      });
    });
  }

  render = () => (
    <div>
      <h2 className="mucapp">Add User</h2>
      <p>Add a new user to MUCAPP.</p>
      <div>
        <div>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="name"
            type="text"
            placeholder="Name"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="email"
            type="email"
            placeholder="Email"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="mobile"
            type="mobile"
            placeholder="Mobile"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="password"
            type="password"
            placeholder="Password"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Select
            isSearchable={false}
            name="college"
            placeholder="College"
            options={this.state.colleges}
            onChange={(e) => this.setState({ college: e.value })}
            styles={{
              control: (provided, state) => ({
                ...provided,
                marginBottom: 10,
                border: state.isFocused ? "1px solid #ffd100" : "1px solid rgba(0, 0, 0, .1)",
                boxShadow: state.isFocused ? "0 3px 10px -5px rgba(0, 0, 0, .3)" : "",
                ":hover": {
                  border: "1px solid #ff5800",
                  boxShadow: "0 3px 10px -5px rgba(0, 0, 0, .3)",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#ff5800" : "",
                ":hover": {
                  backgroundColor: "#ffd100",
                  color: "black",
                },
              }),
            }}
            css={{
              fontSize: "16px",
              width: 300,
            }}
          />
        </div>
        <div>
          <Select
            isSearchable={false}
            name="type"
            placeholder="Account Type"
            options={this.types}
            onChange={(e) => this.setState({ type: e.value })}
            styles={{
              control: (provided, state) => ({
                ...provided,
                marginBottom: 10,
                border: state.isFocused ? "1px solid #ffd100" : "1px solid rgba(0, 0, 0, .1)",
                boxShadow: state.isFocused ? "0 3px 10px -5px rgba(0, 0, 0, .3)" : "",
                ":hover": {
                  border: "1px solid #ff5800",
                  boxShadow: "0 3px 10px -5px rgba(0, 0, 0, .3)",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#ff5800" : "",
                ":hover": {
                  backgroundColor: "#ffd100",
                  color: "black",
                },
              }),
            }}
            css={{
              fontSize: "16px",
              width: 300,
            }}
          />
        </div>
        <div>
          <Button onClick={this.handleClick} disabled={this.state.buttonText === this.ADDING_USER}>{this.state.buttonText}</Button>
        </div>
      </div>
    </div>
  );
};
