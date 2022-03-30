import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";

const styles = {
  memberCard: {
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

const MemberCard = ({ member, team }) => (
  <Link to={"/teams/members/" + member.id + "/edit"} css={{
    ...styles.memberCard,
  }}>
    <div css={{
      fontSize: "1.3em",
    }}>
      {member.name}
    </div>
    <div css={{
      color: "rgba(0, 0, 0, .5)",
    }}>
      {member.registrationID}
    </div>
    <div css={{
      color: "#ff5800",
    }}>
      {team.slice(-7).substring(0, 6)}
    </div>
  </Link>
);

export default class Teams extends React.Component {
  state = {
    college: {},
    events: [],
    teams: {},
  };

  componentWillMount() {
    let user = getUser();

    collegesService.get(user.college).then(college => this.setState({ college }));

    collegesService.getTeams(user.college).then(teams => {
      let sortedTeams = {};

      collegesService.getParticipants(user.college).then(participants => {
        for (let team of teams) {
          let members = participants.filter(member => team.members.includes(member.id));
          team.members = members;
        }

        let events = Array.from(new Set(teams.map(team => team.event.name)));

        for (let event of events) {
          sortedTeams[event] = teams.filter(team => team.event.name === event);
        }

        this.setState({
          events,
          teams: sortedTeams,
        });
      });
    });
  }

  render = () => {
    return (
      <div>
        <div>
          <h2>{this.state.college ? (this.state.college.name + " " + this.state.college.location) : ""} Teams</h2>
        </div>
        <div>
          {
            this.state.events.length
              ? this.state.events.map((event, i) => (
                <div key={i}>
                  <div>
                    <h3>{event}</h3>
                    <p>{this.state.teams[event].length} Teams</p>
                  </div>
                  <div>
                    {
                      this.state.teams[event].map((team) =>
                        team.members.map((member, i) => (
                          <MemberCard key={i} member={member} team={team.name} />
                        ))
                      )
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
