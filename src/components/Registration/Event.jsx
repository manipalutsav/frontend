import React from "react";
import { navigate, Link } from "gatsby";
import { FiX } from "react-icons/fi";

import constants from "../../utils/constants";
import { Button } from "../../commons/Form";
import collegesService from "../../services/colleges";
import eventsService from "../../services/events";
import { getUser } from "../../services/userServices";

const styles = {
  teamCard: {
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

const TeamCard = ({ team }) => {
  let handleDelete = (team) => {
    let surety = typeof window !== "undefined"
      && window.confirm("Are you sure you want to delete " + team.name + "?");

    if (surety) {
      eventsService.deleteTeam(team.event._id, team.id).then(() =>
        navigate("/register/" + team.event._id)
      );
    }
  }

  return (
    <Link to={ "/register/" + team.event._id + "/teams/" + team.id } css={{
      ...styles.teamCard,
    }}>
      <div css={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "1.3em",
      }}>
        <span>{ team.name }</span>
        <span css={{
          cursor: "pointer",
          ":hover": {
            color: "red",
          },
        }}>
          <FiX onClick={ () => handleDelete(team) } />
        </span>
      </div>
      <div css={{
        color: "rgba(0, 0, 0, .5)",
      }}>
        { team.members.length } members
      </div>
    </Link>
  )
};

export default class Events extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      event: {},
      teams: [],
      registrationStatus: null,
    };
  }

  componentWillMount = () => {
    eventsService.get(this.props.event).then(event => {
      let registrationStatus = event.faculty ? constants.registrations.facultyEvents : constants.registrations.studentEvents;

      this.setState({ event, registrationStatus });
    });
    let user = getUser();
    collegesService.getTeams(user.college).then(teams => {
      teams = teams.filter(team => team.event._id === this.props.event );
      teams = teams.map(team => team);

      this.setState({ teams });
    });
  };

  render = () => (
    <div>
      <div>
        <h2>{ this.state.event.name } Registration</h2>
        <p>Register teams for the { this.state.event.name } event in Utsav</p>
        <p>You can register at most { this.state.event.maxTeamsPerCollege } teams for this event.</p>
        <p>Minimum participants: {this.state.event.minMembersPerTeam} </p>
        <p>Maximum participants: {this.state.event.maxMembersPerTeam} </p>
        {
          this.state.registrationStatus
          ? null
          : <p css={{ textTransform: "uppercase", color: "red", }}>Registrations are now closed!</p>
        }
      </div>
      <div css={{
        display: "flex",
        flexWrap: "wrap",
      }}>
        {
          this.state.teams.length < this.state.event.maxTeamsPerCollege
          ? this.state.registrationStatus
            ? <Link to={ "/register/" + this.props.event + "/teams" } css={{
                ...styles.teamCard,
                backgroundColor: "#ff5800",
                color: "white",
                ":hover": {
                  color: "white",
                  boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
                }
              }}>
                Register Team { this.state.teams.length + 1 }
              </Link>
            : null
          : null
        }
        { this.state.teams.map((team, i) => <TeamCard key={i} team={team} />) }
      </div>
      <Button styles={{marginTop: "10px"}} onClick={() => { navigate("/register")} }>Back</Button>
    </div>
  );
};
