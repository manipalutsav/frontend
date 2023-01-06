import React from "react";
import { navigate } from "gatsby";

import { Input, Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";
import colleges from "../../services/colleges";
import LoadContent from "../../commons/LoadContent";

export default class EditCollege extends React.Component {
  UPDATE_COLLEGE = "Edit College";
  UPDATING_COLLEGE = "Updating College..."
  state = {
    buttonText: "Update College"
  };



  async init() {
    try {
      let college = await colleges.get(this.props.college);
      this.setState({ ...college })
      console.log(college)
    } catch (e) {
      toast(e.message)
    }
  }

  componentDidMount() {
    this.init();
  }

  handleChange = (e) => {
    this.setState({ [e.name]: e.value });
  };

  handleCheckbox = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleClick = () => {
    if (!this.state.name)
      return toast("Please enter college name")

    if (!this.state.location)
      return toast("Please enter location")

    this.setState({
      buttonText: this.UPDATING_COLLEGE
    }, async () => {
      let response = await colleges.update({
        id: this.state.id,
        name: this.state.name,
        location: this.state.location,
        isOutStationed: this.state.isOutStationed
      });
      if (!response)
        toast("Some error occured");
      else if (response.status === 200)
        return navigate("/colleges");
      else
        toast(response.message);
      this.setState({ buttonText: this.UPDATE_COLLEGE })

    })
  };

  render = () => (
    <LoadContent loading={!this.state.id}>
      <div>
        <h2 className="mucapp">Update College</h2>
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
              name="location"
              type="text"
              placeholder="Location"
              required
              value={this.state.location}
              styles={{ width: 300 }}
            />
          </div>
          <div>
            <label for="isOutStationed"><input type="checkbox" name="isOutStationed" id="isOutStationed" checked={this.state.isOutStationed} onClick={this.handleCheckbox} />Is Out-stationed college</label>
          </div>
          <div></div>
          <div>
            <Button onClick={this.handleClick} disabled={this.state.buttonText === this.UPDATING_COLLEGE}>{this.state.buttonText}</Button>
          </div>
        </div>
      </div>
    </LoadContent>

  );
};
