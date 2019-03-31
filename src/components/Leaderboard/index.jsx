import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from "../../services/leaderboard";

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      published: false,
    };
  }

  getRank = (points) => {
    if (!this.state.leaderboard.length) return 0;

    let scores = Array.from(new Set(this.state.leaderboard.map(team => team.points)));
    return scores.indexOf(points) + 1;
  };

  handlePublish = () => {
    let leaderboard = this.state.leaderboard.map(team => ({
      college: team.college._id,
      points: team.points,
    }));

    leaderboardService.publish(leaderboard).then(lb =>
      this.setState({ published: !!lb })
    );
  };

  componentWillMount = () => {
    leaderboardService.get().then(lb =>
      this.setState({
        leaderboard: lb.sort((a, b) => parseFloat(b.points) - parseFloat(a.points)),
      })
    );
  };

  render = () => (
    <div>
      <div css={{ textAlign: "center" }}>
        <h1>College Leaderboard</h1>
        <div>
          {
            this.state.published
            ? "Published"
            : <button onClick={ this.handlePublish }>Publish</button>
          }
        </div>
      </div>
      <div>
        {
          this.state.leaderboard.length
          ? this.state.leaderboard.map((team, i) => (
              <LBList
                key={ i }
                position={ this.getRank(team.points) }
                title={ team.college.name }
                description={ team.college.location }
                points={ team.points }
              />
            ))
          : <h1 style={{ textAlign:"center" }}>No results</h1>
        }
      </div>
    </div>
  );
};
