import React from "react";
import { navigate } from "gatsby";

import judgesService from "../../services/judges";
import { Input, Button } from "../../commons/Form";

export default class AddJudge extends React.Component {
  state = {};

  handleChange = (e) => {
    this.setState({ [e.name]: e.value });
  };

  handleClick = async () => {
    let response = judgesService.create({
      name: this.state.name,
    });
    if (!response)
      return;
    navigate("/judges");
  };

  render = () => (
    <div>
      <h2 className="mucapp">Add Judge</h2>
      <p>Add a new judge for Utsav events.</p>
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
          <Button onClick={this.handleClick}>Add</Button>
        </div>
      </div>
    </div>
  );
};
