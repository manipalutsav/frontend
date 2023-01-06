import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";
import LoadContent from "../../commons/LoadContent";
import { toast } from "../../actions/toastActions";
import Block from "../../commons/Block";
import { toUnitText } from "../../utils/common";
import Loop from "../../commons/Loop";

const styles = {
  collegeCard: {
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

const College = (props) => (
  <div css={{
    ...styles.collegeCard,
  }}>
    <div>{props.college.name}</div>
    <div css={{
      fontSize: ".9em",
      color: "grey",
    }}>{props.college.location}</div>
    <div css={{
      fontSize: "0.8em",
      color: "#ff5800",
    }}>
      {console.log(props)}
      <Block show={props.college.teams}>{toUnitText(props.college.teams && props.college.teams.length, "Team")}</Block>
      <Block show={props.college.events}>{toUnitText(props.college.events && props.college.events.size, "Event")}</Block>

    </div>
    <div>
      <Link to={"/colleges/" + props.college.id + "/edit"} className="p-2"><button className="mucapp" >Edit</button></Link>
      <Link to={"/colleges/" + props.college.id + "/teams"}><button className="mucapp">Teams</button></Link>
    </div>
  </div>

);

const CollegeList = (props) => (
  <div css={{
    display: "flex",
    flexWrap: "wrap",
  }}>
    <Link to="/colleges/add" css={{
      ...styles.collegeCard,
      backgroundColor: "#ff5800",
      color: "white",
      ":hover": {
        color: "white",
        boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
      }
    }}>
      Add College
    </Link>

    <Loop name="college" items={props.colleges} component={College} />
  </div>
);

export default class Colleges extends React.Component {
  state = {
    colleges: [],
    teams: [],
    events: [],
    stats: {},
    loading: true,
  };

  componentWillMount() {
    this.init();
  }

  async init() {
    try {
      const colleges = await collegesService.getAll();
      this.setState({ colleges, loading: false });

      const teams = await collegesService.getTeams();

      teams.forEach(team => {

        let college = this.state.colleges.find(college => college.id === team.college);
        if (!college.teams)
          college.teams = [team];
        else
          college.teams.push(team);

        if (!college.events)
          college.events = new Set();
        college.events.add(team.event);
      });

      this.forceUpdate();

    } catch (e) {
      toast("Failed to fetch colleges")
    }
  }

  componentDidUpdate() {
    console.log(this.state);
  }


  render = () => (
    <div>
      <h2 className="mucapp">Colleges</h2>
      <p>Colleges participating in Utsav.</p>
      <LoadContent loading={this.state.loading}>
        <CollegeList colleges={this.state.colleges} stats={this.state.stats} />
      </LoadContent>
    </div>
  );
};
