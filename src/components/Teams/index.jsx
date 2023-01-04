import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";

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
  <Link to={"/colleges/" + props.college + "/teams/" + props.id + "/members"} css={{
    ...styles.teamCard,
  }}>
    <div>{props.name}</div>
    <div css={{
      fontSize: ".7em",
      color: "grey",
    }}>
      {props.members + " member" + (props.members === 1 ? "" : "s")}
    </div>
  </Link>
);

export default class Teams extends React.Component {
  state = {
    events: [],
    teams: {},
  };

  componentWillMount() {
    collegesService.getTeams(this.props.college).then(teams => {
      let sortedTeams = {};
      let events = Array.from(new Set(teams.map(team => team.event.name)));

      for (let event of events) {
        sortedTeams[event] = teams.filter(team => team.event.name === event);
      }

      this.setState({
        events,
        teams: sortedTeams,
      });
    });
  }

  render = () => {
    return (
      <div>
        <div>
          <h2 className="mucapp">Teams</h2>
        </div>
        <div>
          {
            this.state.events.length
              ? this.state.events.map((event, i) => (
                <div key={i}>
                  <div>
                    <h3 className="mucapp">{event}</h3>
                  </div>
                  <div>
                    {
                      this.state.teams[event].map((team, i) => (
                        <TeamCard
                          key={i}
                          id={team.id}
                          college={this.props.college}
                          name={team.name}
                          members={team.members.length}
                        />
                      ))
                    }
                  </div>
                </div>
              ))
              : <div>
                No teams have been registered yet.
              </div>
          }
        </div>
      </div>
    );
  }
};
