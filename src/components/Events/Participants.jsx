import React from "react";
import { navigate } from "gatsby";

import { Button } from "../../commons/Form";
import collegesService from "../../services/colleges";
import { toast } from "../../actions/toastActions";
import LoadContent from "../../commons/LoadContent";

const styles = {
  participantCard: {
    display: "inline-block",
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    width: 250,
    borderRadius: 3,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
    transition: "box-shadow .2s ease",
    ":hover": {
      color: "inherit",
      boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
    },
  },
};


const ParticipantCard = ({ participant }) => (

  <div css={{
    ...styles.participantCard,
  }}>
    <div css={{
      fontSize: "1.3em",
    }}>
      {participant.name}
    </div>
    <div css={{
      color: "rgba(0, 0, 0, .5)",
    }}>
      {participant.registrationID}
    </div>
  </div>

);


export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: [],
      participants: [],
      loading: true
    };
  }

  async init() {

    try {
      let teams = await collegesService.getTeams(this.props.college);
      let team = teams.find(team => team.id === this.props.team);
      let participants = await collegesService.getParticipants(this.props.college);
      participants = participants.filter(participant => team.members.includes(participant.id));
      this.setState({ team, participants, loading: false });
    } catch (e) {
      toast(e.message);
    }
  }

  componentDidMount() {
    this.init();
  }

  render = () => (
    <LoadContent loading={this.state.loading}>
      <div>
        <div>
          <h2 className="mucapp">Participants List</h2>
          <p>{this.state.participants.length} participant{this.state.participants.length === 1 ? "" : "s"}</p>
        </div>
        <div style={{ display: 'flex' }}>
          {
            this.state.participants.map((participant, i) => (
              <ParticipantCard key={i} participant={participant} />
            ))
          }
        </div>
        <div>
          <Button styles={{ marginTop: "10px" }} onClick={() => { navigate("/register") }}>Back</Button>
        </div>
      </div>
    </LoadContent>
  );
};
