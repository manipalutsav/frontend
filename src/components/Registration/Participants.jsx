import React from "react";
import { Link, navigate } from "gatsby";

import { Button } from "../../commons/Form";
import collegesService from "../../services/colleges";
import eventsService from "../../services/events";
import participantService from "../../services/participants";
import { getUser } from "../../services/userServices";
import LoadContent from "../../commons/LoadContent";
import { FiX } from "react-icons/fi";
import { toast } from "../../actions/toastActions";

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

const handleDelete = (eventID, teamID, participantID)=>{
  participantService.deleteOne(eventID, teamID, participantID).then((ok)=>{
    if(ok){
      navigate(0);
    }else
      toast("Could not delete!")
  })
}


const ParticipantCard = ({ participant, team, displayDelete }) => (

  <div css={{
    ...styles.participantCard,
  }}>
    <div css={{
      fontSize: "1.3em",
      display: "flex",
      alignItems: "center",
      gap:8
    }}>
      <span>{participant.name}</span>
      {displayDelete && (<span css={{
          cursor: "pointer",
          ":hover": {
            color: "red",
          },
        }}>
          <FiX onClick={(e) => {
            // console.log(team)
              handleDelete(team.event._id,team._id, participant.id);
            }} /> 
        </span>)}
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
    this.handleDelete = () => {
      // console.log(team);
      let surety = typeof window !== "undefined"
        && window.confirm("Are you sure you want to delete " + this.state.team.name + "?");
  
      if (surety) {
        
        eventsService.deleteTeam(this.state.team.event._id, this.state.team._id).then((ok) =>
          {
            if(ok){
              navigate("/register/" + this.state.team.event._id)
            }
          }
          // console.log("")
        );
          // navigate("/register/" + this.state.team.event._id)
  
      }
    }
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
              <ParticipantCard key={i} participant={participant} team={this.state.team} displayDelete={this.state.team.members.length > this.state.team.event.minMembersPerTeam} />
            ))
          }

        </div>
        
        <div>
          <Button styles={{ marginTop: "10px" }} onClick={() => { navigate("/register/" + this.props.event) }}>Back</Button>
          {
            
            (this.state.participants.length <(this.state.team.event ?(this.state.team.event.maxMembersPerTeam):0))&& (<Link to={"/register/"+this.props.event+"/teams/"+this.props.team+"/update"}><Button>Add member</Button></Link>)
          }
          <Button styles={{ marginTop: "10px", backgroundColor:"red !important" }} onClick={this.handleDelete }>Delete team</Button>
        </div>
      </div>
    </LoadContent>
  );
};
