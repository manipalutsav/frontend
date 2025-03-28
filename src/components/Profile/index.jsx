import React from "react";
import { navigate } from "gatsby";

import { Input } from "../../commons/Form";
import { getUser, logout } from "../../services/userServices";
import usersService from "../../services/users";
import collegeService from '../../services/colleges';
import constants from "../../utils/constants";
import certificateURL from '../../images/facultyCoordinator25.jpg'
import avatar from "../../images/user.svg";
import { toast } from "../../actions/toastActions";

export default class Profile extends React.Component {
  state = {
    user: {},
    changePassword: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.name]: e.value
    })
  }

  handleLogout() {
    if (window.confirm('Are you sure you want to logout?')) {
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

      usersService.update(payload);
    }
  }

  componentDidMount() {
    let user = getUser();

    this.setState({ user }, () =>
      this.state.user.college && collegeService.get(this.state.user.college).then(college => college &&
        this.setState({
          user: {
            ...this.state.user,
            collegeName: college.name + ", " + college.location
          }
        })
      )
    );
  }

  download(member) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const image = new Image();
      const link = document.createElement('a');
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        context.font = "bold 60px Blogger Sans";
        context.fillStyle = "#000000";
        context.textAlign = "center";
        console.log(member);
        context.fillText(member.name, (canvas.width / 2), 540);
        // context.fillText(member.collegeName, (canvas.width / 2), 750);
        const lines = [];
        console.log(member.collegeName.length);
        if (member.collegeName.length > 50) {
          console.log("HIIII");
          const sep = member.collegeName.split(" ");
          
          let line = "";
          let j = 0;
          while (j < sep.length) {
            line += " " + sep[j];
            j++;
            if (line.length >= 45) {
              lines.push(line.trim());
              line = "";
            }
          }
          lines.push(line.trim());
        }
        if (lines.length > 1) {
          // let spacing = 0;
          context.font = "bold 40px Blogger Sans";
          lines.forEach((ln, idx) => {  
            // if (idx !== 0) {
            //   spacing = 30;
            // }
            context.fillText(
              ln,
              canvas.width / 2,
              820 - (lines.length - idx) * 50
            );
          });
        } else {
            context.font = "bold 50px Blogger Sans";
            context.fillText(member.collegeName, canvas.width / 2, 750);
          }


        canvas.toBlob((blob) => {
          link.href = URL.createObjectURL(blob);
          link.download = member.name +  ".png"
          link.style.display = "none";
          document.body.append(link);
          link.click();
          link.remove();
        }, 'image/png');
      };
      image.src = certificateURL;
    }

  render() {
    return (
      <div css={{
        marginTop: 50,
        textAlign: "center",
      }}>
        <div>
          <img className="mucapp" src={avatar} alt="Avatar" height="200" width="200" />
        </div>
        <div>
          <h1 className="mucapp"> {this.state.user.name || "..."}</h1>
          <p css={{ color: "rgba(0, 0, 0, .7)" }}>{this.state.user.email || "..."}</p>
          <p css={{ color: "truergba(0, 0, 0, .5)" }}>{this.state.user.type ? constants.getUserType(this.state.user.type) : "..."}</p>
          <p css={{ color: "rgba(0, 0, 0, .7)" }}>{this.state.user.collegeName}</p>
        </div>
        <div>
          <button className="mucapp" css={{ margin: 5, }} onClick={() => this.handleLogout()}>{"Logout"}</button>
          <button className="mucapp" css={{ margin: 5, }} onClick={() => this.handleChangePassword()}>{this.state.changePassword ? "Change?" : "Change Password"}</button>
          {constants.getUserType(this.state.user.type) === "FACULTY COORDINATOR" ? <button className="mucapp" css={{ margin: 5, }} onClick={()=>{this.download(this.state.user)}}>{"Download Certificate"}</button> : null}
        </div>
        <div>
          {
            this.state.changePassword
              ? <div>
                <br />
                <Input onChange={this.handleChange} type="password" name="password:old" placeholder="Old Password" />
                <br />
                <Input onChange={this.handleChange} type="password" name="password:new" placeholder="New Password" />
                <br />
                <Input onChange={this.handleChange} type="password" name="password:new:confirm" placeholder="Confirm Password" />
              </div>
              : null
          }
        </div>
      </div >
    );
  }
}
