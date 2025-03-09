import React from 'react';
import { navigate } from 'gatsby';

import constants from '../../utils/constants';
import eventsService from '../../services/events';
import collegesService from '../../services/colleges';

import { getUser } from '../../services/userServices';
import { Input, Button } from '../../commons/Form';
import { toast } from '../../actions/toastActions';

const Participant = (props) => (
  <div>
    <h3 className="mucapp">Participant {props.cnt}</h3>
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
  REGISTERING = 'Registering...';
  REGISTER = 'Register';
  constructor(props) {
    super(props);

    this.state = {
      existingParticipants: [],
      event: [],
      participantsInput: [],
      participants: [],
      button: this.REGISTER,
      registrationStatus: null,
      team: null,
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
    let participants = this.state.participants.map((participant) => ({
      ...participant,
      faculty:
        participant.registrationID &&
        participant.registrationID.match(/(MAHE|MSS|MAGE|EC)/)
          ? true
          : false,
    }));

    //VALIDATIONS
    for (let i = 0; i < this.state.participants.length; i++) {
      let participant = this.state.participants[i];

      if (!participant)
        return toast(
          `Participant ${i + 1}: Please fill register number and name`
        );

      if (!participant.registrationID)
        return toast(`Participant ${i + 1}: Register number missing`);

      if (participant.registrationID.match(/\s/))
        return toast(
          `Participant ${i + 1}: Registration id cannot contain spaces.`
        );

      if (
        !participant.registrationID.match(
          /^(?:(?:MAHE[\d]{7})|(?:MAHER[\d]{6})|(?:MSS[\d]{4,5})|(?:MAGE[\d]{8})|(?:EC[\d]{4,5})|(?:[\d]{9}))$/
        )
      )
        return toast(`Participant ${i + 1}: Registration id is invalid`);

      if (
        this.state.event.faculty &&
        !this.state.event.name.match(/variety/i) &&
        participant.registrationID.match(/^[\d]{9}$/)
      )
        return toast(
          `Participant ${i +
            1}: Registration id not accepted for faculty events`
        );

      if (
        !this.state.event.faculty &&
        !participant.registrationID.match(/^[\d]{9}$/)
      )
        return toast(
          `Participant ${i +
            1}: Registration id not accepted for student events`
        );

      if (!participant.name || participant.name.length === 0)
        return toast(`Participant ${i + 1}: Name is missing`);

      if (!participant.name.match(/^[A-Z.\s]*$/i))
        return toast(
          `Participant ${i +
            1}:  Name cannot contain only alphabets, spaces and .`
        );
    }

    let researchScholars = this.state.participants.filter((participant) =>
      participant.registrationID.match(/MAHER|[\d]{9}/i)
    );
    if (
      researchScholars.length > 7 &&
      this.state.event.name.match(/variety/i)
    ) {
      return toast(`Cannot have more than 7 research scholars for the event`);
    }

    for (let i = 0; i < this.state.participants.length; i++) {
      for (let j = 0; j < this.state.participants.length; j++) {
        if (
          i !== j &&
          this.state.participants[i].registrationID ===
            this.state.participants[j].registrationID
        )
          return toast(
            this.state.participants[i].registrationID +
              ' has been entered more than once'
          );
      }
    }

    for (let i = 0; i < this.state.participants.length; i++) {
      for (let j = 0; j < this.state.existingParticipants.length; j++) {
        if (
          i !== j &&
          this.state.participants[i].registrationID ===
            this.state.existingParticipants[j].registrationID
        )
          return toast(
            this.state.participants[i].registrationID +
              ' has been entered more than once'
          );
      }
    }

    this.setState(
      {
        button: this.REGISTERING,
      },
      () => {
        eventsService
          .updateTeam(this.state.event.id, this.state.team._id, {
            participants,
          })
          .then((team) =>
            navigate(
              '/register/' +
                this.state.event.id +
                '/teams/' +
                this.state.team._id
            )
          );
      }
    );
  };

  async init() {
    let user = getUser();
    let teams = await collegesService.getTeams(user.college);
    let team = teams.find((team) => team._id === this.props.team);
    let existingParticipants = await collegesService.getParticipants(
      user.college
    );
    existingParticipants = existingParticipants.filter((participant) =>
      team.members.includes(participant.id)
    );
    eventsService.get(this.props.event).then((event) => {
      if (!event.maxMembersPerTeam) event.maxMembersPerTeam = 1;

      let participantsInput = [];

      let user = getUser();
      collegesService
        .getTeams(user.college)
        .then((teams) => {
          let team = teams.find((t) => t._id == this.props.team);
          const remainingMemberCount =
            event.maxMembersPerTeam - team.members.length;
          // for (let i = (event.maxMembersPerTeam-remainingMemberCount); i < remainingMemberCount; i++) {
          for (
            let i = 0, j = event.maxMembersPerTeam - remainingMemberCount;
            i < remainingMemberCount;
            i++, j++
          ) {
            participantsInput.push(
              <Participant
                handleChange={this.handleChange}
                key={i}
                count={i + 1}
                cnt={j + 1}
              />
            );
          }
          this.setState({
            existingParticipants,
            event,
            participantsInput,
            registrationStatus: event.faculty
              ? constants.registrations.facultyEvents
              : constants.registrations.studentEvents,
            team,
          });
        })
        .catch((err) => {
          toast('Some error occured! ' + err);
        });
    });
  }

  componentWillMount = () => {
    this.init();
  };

  render = () =>
    this.state.registrationStatus === false ? (
      <div>
        <h2 className="mucapp">{this.state.event.name}</h2>
        <div css={{ color: 'red' }}>Registrations are now closed!</div>
      </div>
    ) : (
      <div>
        <div>
          <h2 className="mucapp">Team Registration</h2>
          <p>
            Update your team for the {this.state.event.name} event in Utsav.
          </p>
        </div>
        <div>
          {this.state.event && this.state.team && (
            <>
              {this.state.participantsInput.length} more members can be
              registered
            </>
          )}
          {this.state.participantsInput.map((participants) => participants)}
          <div css={{ marginTop: '20px' }}>
            <Button
              onClick={this.handleSubmit}
              disabled={this.state.button === this.REGISTERING}
            >
              {this.state.button}
            </Button>
            <Button
              styles={{ marginLeft: '10px' }}
              onClick={() => {
                navigate(
                  '/register/' + this.props.event + '/teams/' + this.props.team
                );
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
}
