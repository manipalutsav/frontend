import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";
import LoadContent from "../../commons/LoadContent";
import { isTeamChangeFreezed } from "../../utils/common";

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
  <Link to={!isTeamChangeFreezed() && "/teams/members/" + member.id + "/edit"} css={{
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
      {team.name}
    </div>
  </Link>
);

export default class Teams extends React.Component {
  state = {
    college: {},
    collegeLoading: true,
    events: [],
    teams: {},
    teamsLoading: true
  };

  componentWillMount() {
    let user = getUser();

    collegesService.get(user.college).then(college => this.setState({ college, collegeLoading: false }));

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
          teamsLoading: false
        });
      });
    });
  }

  render = () => {
    console.log(this.state)
    return (
      <LoadContent loading={this.state.collegeLoading}>
        <div>
          <h2 className="mucapp">{this.state.college ? (this.state.college.name + " " + this.state.college.location) : ""} Teams</h2>
        </div>
        <div>
          <button onClick={() => this.props.navigate("./rankings")} className="mucapp">View Event Rankings</button>
        </div>
        <LoadContent loading={this.state.teamsLoading}>
          {
            this.state.events.length
              ? this.state.events.map((event, i) => (
                <div key={i}>
                  <div>
                    <h3 className="mucapp">{event}</h3>
                    <p>{this.state.teams[event].length} Teams</p>
                  </div>
                  <div>
                    {
                      this.state.teams[event].map((team) =>
                        team.members.map((member, i) => (
                          <MemberCard key={i} member={member} team={team} />
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
        </LoadContent>
      </LoadContent>
    );
  }
};
