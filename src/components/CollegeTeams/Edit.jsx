import React from "react";
import { navigate } from "gatsby";

import participantsService from "../../services/participants";

import { Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";

export default class EditMember extends React.Component {
  UPDATE = "Update";
  UPDATING = "Updating...";

  state = {
    buttonText: this.UPDATE,
    participant: {},
  };

  handleChange = (e) => {
    this.setState({
      participant: {
        ...this.state.participant,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleClick = () => {
    if (!this.state.participant.name) return toast("Please enter name");
    if (!this.state.participant.registrationID) return toast("Please enter registration number");


    this.setState({
      buttonText: this.UPDATING
    }, () => {
      participantsService.update(this.props.member, this.state.participant)
        .then(() => navigate("/teams"))
        .catch(() => this.setState({ buttonText: this.UPDATE }));
    });
  };

  componentWillMount() {
    participantsService.get(this.props.member).then(participant => {

      this.setState({ participant: participant || {} })
    });
  }

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">Edit Participant {this.state.participant.name}</h2>
      </div>

      <div>
        <div>
          <div>Name</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="name"
            type="text"
            value={this.state.participant.name}
            placeholder="Name"
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Registration Number</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="registrationID"
            type="text"
            value={this.state.participant.registrationID}
            placeholder="Registration Number"
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <Button
            onClick={this.handleClick}
            disabled={this.state.buttonText === this.UPDATING}
          >
            {this.state.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
