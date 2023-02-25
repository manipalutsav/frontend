import React from "react";
import { navigate, Link } from "gatsby";
import Select from "react-select";

import reducer from "../../reducers/commonReducer";
import { updateUser } from "../../services/userServices";
import { Input, Button } from "../../commons/Form";
import constants from "../../utils/constants";
import { getAll } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
import usersService from '../../services/users';
import Loader from "../../commons/Loader";
import LoadContent from "../../commons/LoadContent";

export default class EditUser extends React.Component {

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
  ADD_USER = "Update";
  ADDING_USER = "Updating...";
  state = {
    colleges: [],
    buttonText: this.ADD_USER,
    user_loading: true
  };

  handleChange = (e) => {
    this.setState({ [e.name]: e.value });
  };

  handleClick = () => {
    if (!this.state.name)
      return toast("Please enter name");
    if (!this.state.email)
      return toast("Please enter email id");
    if (!this.state.college)
      return toast("Please select college");
    if (!this.state.type)
      return toast("Please select user type");

    this.setState({
      buttonText: this.ADDING_USER
    }, async () => {
      let response = await updateUser(this.props.user, {
        name: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
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
  getUser = async () => {
    let user = await usersService.get2(this.props.user);
    this.setState({ ...user, user_loading: false });
    this.forceUpdate();
  }
  componentWillMount() {
    getAll();
    this.getUser();
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
  getCollege() {
    let college = this.state.college;
    if (!college || this.state.colleges.length === 0)
      return '';
    let res = this.state.colleges.find(elem => elem.value === college)
    return res ? res : '';
  }
  render = () => (
    <div css={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 className="mucapp">Edit User</h2>
      <p>Edit user of MUCAPP.</p>
      <LoadContent loading={this.state.user_loading}>
        <div>
          <div>
            <Input
              onChange={this.handleChange}
              autoComplete="off"
              name="name"
              type="text"
              placeholder="Name"
              required
              value={this.state.name}
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
              value={this.state.email}
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
              value={this.state.mobile}
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
              value={this.getCollege()}
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
              value={{ label: constants.getUserType(this.state.type), value: this.state.type }}
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
          <div style={{ textAlign: "center" }}>
            <Button onClick={this.handleClick} disabled={this.state.buttonText === this.ADDING_USER}>{this.state.buttonText}</Button>
            <Link to="/users"><Button styles={{ marginLeft: 10 }}>Cancel</Button></Link>
          </div>
        </div>
      </LoadContent>
    </div>
  );
};
