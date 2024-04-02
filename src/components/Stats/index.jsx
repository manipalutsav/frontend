import React from "react";

import statsService from "../../services/stats";

const styles = {
  statsCard: {
    display: "flex",
    alignItems: "center",
    margin: 20,
    padding: 10,
    minWidth: 300,
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

const StatsCard = (props) => (
  <div css={{
    ...styles.statsCard,
    flexDirection: "column",
    padding: 20,
    minWidth: 250,
    maxWidth: 250,
    textAlign: "center",
  }}>
    <div css={{
      fontSize: "3em",
      color: "#ff5800",
    }}>
      {props.count}
    </div>
    <div css={{
      fontSize: "1.5em",
    }}>
      {props.name}
    </div>
    <div css={{
      color: "grey",
    }}>
      {props.meta}
    </div>
  </div>
);

export default class extends React.PureComponent {
  state = {
    stats: {},
  };

  componentWillMount = () => {
    statsService.get().then(stats => {
      this.setState({ stats, })
    });
  }

  render = () => (
    <>
      <div css={{
        textAlign: "center",
      }}>
        <h1 className="mucapp"> UTSAV {new Date().getFullYear()} Statistics</h1>
      </div>
      <div css={{
        display: "flex",
        margin: "0 auto",
        maxWidth: 1000,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <StatsCard
          name="Colleges"
          // count={this.state.stats.colleges && this.state.stats.colleges.total}
          count={25}
          meta={"From " + (this.state.stats.colleges && this.state.stats.colleges.locations) + " locations"}
        />
        <StatsCard
          name="Events"
          count={this.state.stats.events && this.state.stats.events.total}
          meta={"In " + (this.state.stats.events && this.state.stats.events.venues) + " venues"}
        />
        <StatsCard
          name="Staff Events"
          count={this.state.stats.events && this.state.stats.events.staff}
          meta={(this.state.stats.participants && this.state.stats.participants.staff) + " participanting staff"}
        />
        <StatsCard
          name="Individual Participants"
          count={this.state.stats.participants && (this.state.stats.participants.total - this.state.stats.participants.staff)}
          meta={"Excluding staff"}
        />
        <StatsCard
          name="Group Participants"
          count={this.state.stats.teams && this.state.stats.teams.total}
        />
        <StatsCard
          name="Days"
          count="5"
          meta="1 day for staff"
        />
      </div>
    </>
  )
};
