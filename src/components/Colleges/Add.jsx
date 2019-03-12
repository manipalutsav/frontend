import React from "react";
import { navigate } from "gatsby";

import reducer from "../../reducers/commonReducer";
import { create } from "../../services/collegeServices";
import { Input, Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";

export default class AddCollege extends React.Component {
  ADD_COLLEGE = "Add College";
  ADDING_COLLEGE = "Adding College..."
  state = {
    buttonText:"Add College"
  };

  handleChange = (e) => {
    this.setState({ [e.name]: e.value });
  };

  handleClick = () => {
    if(!this.state.name)
      return toast("Please enter college name")

    if(!this.state.location)
      return toast("Please enter location")

    this.setState({
      buttonText:this.ADDING_COLLEGE
    },async ()=>{
      let response = await create({
        name: this.state.name,
        location: this.state.location,
      });
      if(!response)
        toast("Some error occured");
      else if(response.status===200)
        return navigate("/colleges");
      else
        toast(response.message);
      this.setState({buttonText:this.ADD_COLLEGE})
      
    })
  };

  render = () => (
    <div>
      <h2>Add College</h2>
      <p>Add a new college to Utsav.</p>
      <div>
        <div>
          <Input
            onChange={ this.handleChange }
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
            onChange={ this.handleChange }
            autoComplete="off"
            name="location"
            type="text"
            placeholder="Location"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Button onClick={this.handleClick} disabled={this.state.buttonText===this.ADDING_COLLEGE}>{this.state.buttonText}</Button>
        </div>
      </div>
    </div>
  );
};
