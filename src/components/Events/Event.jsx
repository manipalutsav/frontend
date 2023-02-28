import React from "react";
import { Link } from "gatsby";

import eventsService from "../../services/events";
import LoadContent from "../../commons/LoadContent";
import { toast } from "../../actions/toastActions";
import participationStatus from "../../services/participationStatus";
import colleges from "../../services/colleges";

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
  <Link to={"/colleges/" + props.team.college._id + "/teams/" + props.team._id + "/members"} css={{
    ...styles.teamCard,
  }}>
    <div>{props.team.college.name} {props.team.college.location}({props.team.name})</div>
    <div css={{
      fontSize: ".7em",
      color: "grey",
    }}>
      {props.team.members.length + " member" + (props.team.members.length === 1 ? "" : "s")}
    </div>
  </Link>
);

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      teams: [],
      statues: [],
      descriptionStatus: false,
      loading: true,
      participationStatus: {}
    };
  }

  toggleDescription = () => this.setState({ descriptionStatus: !this.state.descriptionStatus });


  async init() {
    try {
      let event = await eventsService.get(this.props.event);
      let teams = await eventsService.getTeams(this.props.event);
      let statues = await participationStatus.getByEvent(this.props.event);
      let collegeList = await colleges.getAll();
      statues = statues.map(status => ({ ...status, college: collegeList.find(college => college.id === status.college) }))
      let participationStatusObj = {
        yes: 0,
        no: 0,
        maybe: 0
      };
      statues.forEach(obj => {

        if (obj.status === "Yes")
          participationStatusObj.yes++;
        else if (obj.status === "Maybe")
          participationStatusObj.maybe++;
        else
          participationStatusObj.no++;
      });
      console.log(statues)
      this.setState({ teams, event, statues, participationStatus: participationStatusObj, loading: false });
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
          {
            this.state.event
              ? <>
                <h2 className="mucapp">{this.state.event.name}</h2>
                <p>
                  {this.state.event.faculty ? "Faculty Event" : "Student Event"} organized by {this.state.event.college && this.state.event.college.name + ", " + this.state.event.college.location}
                </p>
                <p>
                  at {this.state.event.venue}
                  <br />
                  from {(new Date(this.state.event.startDate)).toLocaleString()} to {(new Date(this.state.event.endDate)).toLocaleString()}
                </p>
                <p>
                  A maximum of {this.state.event.maxTeamsPerCollege} team{this.state.event.maxTeamsPerCollege === 1 ? "" : "s"} can participate from one college.
                  <br />
                  {
                    this.state.event.minMembersPerTeam === this.state.event.maxMembersPerTeam
                      ? "A team should have " + this.state.event.minMembersPerTeam + " members."
                      : "A team can contain a minimum of " + this.state.event.minMembersPerTeam + " members and a maximum of " + this.state.event.maxMembersPerTeam + " members."
                  }
                </p>
                <p css={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "0.9em",
                  whiteSpace: "pre-wrap",
                }}>
                  <button
                    className="mucapp"
                    onClick={this.toggleDescription}
                    css={{
                      marginBottom: 10,
                      width: 255,
                    }}
                  >
                    {
                      this.state.descriptionStatus
                        ? "Hide Rules"
                        : "Show Rules"
                    }
                  </button>
                  {
                    this.state.descriptionStatus
                      ? this.state.event.description
                      : null
                  }
                </p>
                <div>
                  <Link to={"/events/" + this.props.event + "/rounds"} css={{
                    marginRight: 10,
                  }}>
                    <button className="mucapp">View Rounds</button>
                  </Link>
                  <Link to={"/events/" + this.props.event + "/edit"}>
                    <button className="mucapp">Edit Event</button>
                  </Link>
                </div>
              </>
              : null
          }
        </div>
        <div>
          <h3>Colleges Participation</h3>
          <table className="table w-full table-zebra" >
            <thead><tr>
              <th>Sl. No.</th>
              <th>College</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              {this.state.statues.map((status, index) => <tr>
                <td>{index + 1}.</td>
                <td>{status.college.name}, {status.college.location}</td>
                <td>{status.status}</td>
                <td>
                </td>
              </tr>)}
            </tbody>
          </table>
          <h4>Summary:</h4>
          <p>Yes: {this.state.participationStatus.yes}</p>
          <p>Maybe: {this.state.participationStatus.maybe}</p>
          <p>No: {this.state.participationStatus.no}</p>
        </div>
        <div>
          <div>
            <h3 className="mucapp">Participating Teams</h3>
            <p>A total of {this.state.teams.length} teams are participating.</p>
          </div>
          <div css={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
          }}>
            {
              this.state.teams.map((team, i) =>
                <TeamCard key={i} team={team} />
              )
            }
          </div>
        </div>
      </div>
    </LoadContent>
  );
};
