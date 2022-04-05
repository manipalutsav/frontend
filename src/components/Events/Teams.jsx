import React from "react";
import { Link } from "gatsby";

import { getTeams2 } from "../../services/eventService";
import Loader from "../../commons/Loader";


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
    }
  },
};

const TeamCard = (props) => (
  <Link to={`/events/${props.team.event}/teams/${props.team.college}/${props.team.id}`} css={{
    ...styles.teamCard,
  }}>
    <div>{props.team.college.name} {props.team.name}</div>
    <div css={{
      fontSize: ".7em",
      color: "grey",
    }}>
      {props.team.members + " member" + (props.team.members === 1 ? "" : "s")}
    </div>
  </Link>
);

export default class Teams extends React.Component {
  state = {
    colleges: [],
    teams: {},
    loaded: false
  };

  async componentWillMount() {
    let teams = await getTeams2(this.props.event);
    teams = teams.map(team => ({
      name: team.name,
      id: team.id,
      event: team.event,
      college: team.college,
      members: team.members.length
    }));

    this.setState({ teams, loaded: true });
    /*
    let sortedTeams = {};
    let colleges = Array.from(new Set(teams.map(team => team.event.name)));
    for (let event of events) {
      sortedTeams[event] = teams.filter(team => team.event.name === event);
    }

    this.setState({
      events,
      teams: sortedTeams,
    });*/

  }

  render = () => {
    return (
      <div>
        <div>
          <h2>Teams</h2>
        </div>
        <div>
          {this.state.loaded ? <>
            {this.state.teams.length ? <>
              {
                this.state.teams.map((team, key) =>
                  <TeamCard key={key} team={team} />
                )
              }
            </> : "No teams have registered yet."}
          </> : <Loader />}
        </div>
      </div>
    );
  }
};
