import React from "react";
import { navigate, Link } from "gatsby";

import { getUser, logout } from "../../services/userServices";
import usersService from "../../services/users";
import collegeService from '../../services/colleges';
import constants from "../../utils/constants";

import avatar from "../../images/user.svg";
import { toast } from "../../actions/toastActions";

export default class Profile extends React.Component {
  state = {
    logoutClicks: 0,
    changePassword: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.name]: e.value
    })
  }

  handleLogout() {
    if (!this.state.logoutClicks) {
      this.setState({
        logoutClicks: this.state.logoutClicks + 1,
      });
    } else {
      this.setState({
        logoutClicks: this.state.logoutClicks - 1,
      });

      logout(() => {
        navigate("/");
        return null;
      });
    }
  }

  handleChangePassword() {
    this.setState({
      changePassword: !this.state.changePassword,
    });

    if (this.state["password:new"] !== this.state["password:new:confirm"]) {
      return toast("Confirm pasword does not match");
    }


    if (this.state.changePassword) {
      let payload = {
        oldUser: {
          ...this.state.user,
          password: this.state["password:old"],
        },
        newUser: {
          ...this.state.user,
          password: this.state["password:new"],
        },
      };

      // TODO: Check if oldpassword is correct, & new & confirm passwords match

      usersService.update(payload);
    }
  }

  componentWillMount() {
    this.getUser();

  }

  getUser = async () => {
    let user = await usersService.get2(this.props.user);
    this.setState(user, this.getCollege);
  }

  getCollege = async () => {
    if (!this.state.college)
      return;
    let response = await collegeService.getCollege(this.state.college);
    if (!response)
      return;
    this.setState({
      collegeName: response.name + ", " + response.location
    })
  }

  render() {
    let { name, email, mobile, collegeName, type } = this.state;


    return (
      <div css={{
        marginTop: 50,
        textAlign: "center",
      }}>
        <div>
          <img className="mucapp" src={avatar} alt="Avatar" height="200" width="200" />
        </div>
        <div>
          <h1 className="mucapp"> {name || "..."}</h1>
          <p css={{ color: "rgba(0, 0, 0, .7)" }}>{email || "..."}</p>
          <p css={{ color: "rgba(0, 0, 0, .7)" }}>{mobile || "..."}</p>
          <p css={{ color: "truergba(0, 0, 0, .5)" }}>{type ? constants.getUserType(type) : "..."}</p>
          <p css={{ color: "rgba(0, 0, 0, .7)" }}>{collegeName}</p>
        </div>
        <div>
          {getUser().type && getUser().type === 1 ? <Link to={`/users/${this.props.user}/edit`}><button className="mucapp" css={{ margin: 5, }}>Edit</button></Link> : ''}
          <Link to="/users"><button className="mucapp" css={{ margin: 5, }}>Go Back</button></Link>
        </div>

      </div >
    );
  }
}
