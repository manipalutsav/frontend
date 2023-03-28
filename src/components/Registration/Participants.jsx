import React from "react";
import { Link, navigate } from "gatsby";

import { Button } from "../../commons/Form";
import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";
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
    let user = getUser();
    let teams = await collegesService.getTeams(user.college);
    let team = teams.find(team => team._id === this.props.team);
    let participants = await collegesService.getParticipants(user.college);
    participants = participants.filter(participant => team.members.includes(participant.id));
    this.setState({ team, participants, loading: false });
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
          <Button styles={{ marginTop: "10px" }} onClick={() => { navigate("/register/" + this.props.event) }}>Back</Button>
          {
            
            (this.state.participants.length <(this.state.team.event ?(this.state.team.event.maxMembersPerTeam):0))&& (<Link to={"/register/"+this.props.event+"/teams/"+this.props.team+"/update"}><Button>Add member</Button></Link>)
          }
        </div>
      </div>
    </LoadContent>
  );
};
