import React from "react";
import { navigate } from "gatsby";

import constants from "../../utils/constants";
import eventsService from "../../services/events";
import { getUser } from "../../services/userServices";
import { Input, Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";

const Participant = (props) => (
  <div>
    <h3 className="mucapp">Participant {props.count}</h3>
    <Input
      name="registrationID"
      type="text"
      placeholder="Registration no."
      pattern="/^(?:(?:MAHE[\d]{7})|(?:[\d]{9}))$/"
      onChange={(e) => props.handleChange(props.count - 1, e)}
    />
    &ensp;
    <Input
      name="name"
      type="text"
      placeholder="Name"
      onChange={(e) => props.handleChange(props.count - 1, e)}
    />
  </div>
);

export default class Events extends React.Component {
  REGISTERING = "Registering..."
  REGISTER = "Register"
  constructor(props) {
    super(props);

    this.state = {
      event: [],
      participantsInput: [],
      participants: [],
      button: this.REGISTER,
      registrationStatus: null,
    };
  }


  handleChange = (index, e) => {
    let participants = this.state.participants;
    participants[index] = {
      ...participants[index],
      [e.name]: e.value,
    };

    this.setState({
      participants,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let participants = this.state.participants.map(participant => ({
      ...participant,
      faculty: participant.registrationID && participant.registrationID.match(/(MAHE|MSS|MAGE|EC)/) ? true : false,
    }));

    //VALIDATIONS
    for (let i = 0; i < this.state.participants.length; i++) {

      let participant = this.state.participants[i];

      if (!participant)
        return toast(`Participant ${i + 1}: Please fill register number and name`);


      if (!participant.registrationID)
        return toast(`Participant ${i + 1}: Register number missing`);

      if (participant.registrationID.match(/\s/))
        return toast(`Participant ${i + 1}: Registration id cannot contain spaces.`);

      if (!participant.registrationID.match(/^(?:(?:MAHE[\d]{7})|(?:MSS[\d]{4,5})|(?:MAGE[\d]{8})|(?:EC[\d]{4,5})|(?:[\d]{9}))$/))
        return toast(`Participant ${i + 1}: Registration id is invalid`);

      if (this.state.event.faculty && participant.registrationID.match(/^[\d]{9}$/))
        return toast(`Participant ${i + 1}: Registration id not accepted for faculty events`);

      if (!this.state.event.faculty && !participant.registrationID.match(/^[\d]{9}$/))
        return toast(`Participant ${i + 1}: Registration id not accepted for student events`);

      if (!participant.name || participant.name.length === 0)
        return toast(`Participant ${i + 1}: Name is missing`);

      if (!participant.name.match(/^[A-Z.\s]*$/i))
        return toast(`Participant ${i + 1}:  Name cannot contain only alphabets, spaces and .`);

    }

    if (this.state.participants.length < this.state.event.minMembersPerTeam)
      return toast("Minimum of " + this.state.event.minMembersPerTeam + " participants are required to register for this event.");

    for (let i = 0; i < this.state.participants.length; i++)
      for (let j = 0; j < this.state.participants.length; j++)
        if (i !== j && this.state.participants[i] === this.state.participants[j])
          return toast(this.state.participants[i] + " has been entered more then once");

    let user = getUser();
    this.setState({
      button: this.REGISTERING
    }, () => {
      eventsService.createTeam(this.state.event.id, {
        college: user.college,
        participants,
      }).then(team =>
        navigate("/register/" + this.state.event.id)
      );
    })


  };

  componentWillMount = () => {
    eventsService.get(this.props.event).then(event => {
      if (!event.maxMembersPerTeam) event.maxMembersPerTeam = 1;

      let participantsInput = [];

      for (let i = 0; i < event.maxMembersPerTeam; i++) {
        participantsInput.push(<Participant handleChange={this.handleChange} key={i} count={i + 1} />);
      }

      this.setState({
        event,
        participantsInput,
        registrationStatus: event.faculty ? constants.registrations.facultyEvents : constants.registrations.studentEvents,
      });
    });
  };

  render = () => (
    this.state.registrationStatus === false
      ? <div>
        <h2 className="mucapp">{this.state.event.name}</h2>
        <div css={{ color: "red", }}>Registrations are now closed!</div>
      </div>
      : <div>
        <div>
          <h2 className="mucapp">Team Registration</h2>
          <p>Register a team for the {this.state.event.name} event in Utsav.</p>
        </div>
        <div>
          {
            this.state.participantsInput.map(participants => participants)
          }
          <div css={{ marginTop: "20px" }}>
            <Button onClick={this.handleSubmit} disabled={this.state.button === this.REGISTERING}>{this.state.button}</Button>
            <Button styles={{ marginLeft: "10px" }} onClick={() => { navigate("/register") }}>Cancel</Button>
          </div>
        </div>
      </div>
  );
};
