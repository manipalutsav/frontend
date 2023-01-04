import React from "react";

import collegesService from "../../services/colleges";

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


const MemberCard = ({ member }) => (
  <div css={{
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
  </div>
);


export default class Members extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: {
        college: {}
      },
      members: []
    };
  }

  componentWillMount = () => {
    collegesService.getTeams(this.props.college).then(teams => {
      let team = teams.find(team => team.id === this.props.team);

      collegesService.getParticipants(this.props.college).then(members => {
        members = members.filter(member => team.members.includes(member.id));
        this.setState({ team, members, });
      });
    });
  };

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">{this.state.team.event && this.state.team.event.name} </h2>
        <h3 className="mucapp">{this.state.team.college.name} {this.state.team.college.location} ({this.state.team.name})</h3>
        <p>{this.state.members.length} member{this.state.members.length === 1 ? "" : "s"}</p>
      </div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
      }}>
        {
          this.state.members.map((member, i) => (
            <MemberCard key={i} member={member} />
          ))
        }
      </div>
    </div>
  );
};
