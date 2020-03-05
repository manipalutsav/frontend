import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";
import reducer from "../../reducers/commonReducer";
import { getAll } from "../../services/collegeServices";
import Loader from "../../commons/Loader";

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
  <Link to={ "/colleges/" + props.info.id + "/teams" } css={{
    // link on click
    ...styles.collegeCard,
  }}>
    <div>{ props.info.name }</div>
    <div css={{
      fontSize: ".9em",
      color: "grey",
    }}>{ props.info.location }</div>
    <div css={{
      fontSize: "0.8em",
      color: "#ff5800",
    }}>
      {
        props.stats.teams
        ? props.stats.teams + " team" + (props.stats.teams === 1 ? "" : "s")
          + " in " + props.stats.events.length + " event" + (props.stats.events.length === 1 ? "" : "s")
        : "no registrations yet"
      }
    </div>
  </Link>
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
    {/* Colleges rendered */}
    {
      props.colleges
      ? props.colleges.map((college, i) => (
          <College
            key={ i }
            info={ college }
            stats={ props.stats[college.id] || { teams: 0, events: [], } }
          />
        ))
      : null
    }
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
    collegesService.getTeams().then(teams => {
      let collegeCounts = {};

      for (let team of teams) {
        if (collegeCounts.hasOwnProperty(team.college)) {
          collegeCounts[team.college].teams++;
          collegeCounts[team.college].events.push(team.event);
          collegeCounts[team.college].events = Array.from(new Set(collegeCounts[team.college].events));
        } else {
          collegeCounts[team.college] = {
            teams: 1,
            events: [ team.event ],
          };
        }
      }


      let collegeTeams = {};

      for (let team of teams) {
        if (collegeTeams.hasOwnProperty(team.college)) collegeTeams[team.college]++;
        else collegeTeams[team.college] = 0;
      }

      this.setState({
        teams: collegeTeams,
        stats: collegeCounts,
      });
    });

    getAll();

    this.unsubscribe=reducer.subscribe(() => {
      reducer.getState().then(state => {
        this.setState({ colleges: state.data.list, loading: false });
      });
    });
  }
  componentWillUnmount(){
    this.unsubscribe();
  }

  render = () => (
    <div>
      <h2>Colleges</h2>
      <p>Colleges participating in Utsav.</p>
      <div>
        {
          this.state.loading
          ? <Loader/>
          : <CollegeList
              colleges={ this.state.colleges } stats={ this.state.stats }
              // college list rendered
            />
        }
      </div>
    </div>
  );
};
