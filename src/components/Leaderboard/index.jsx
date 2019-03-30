import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from '../../services/leaderboard';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
    };
  }

  componentWillMount = async () => {
    let response = await leaderboardService.get();
    this.setState({
      leaderboard: response.sort((a, b) => parseFloat(b.points) - parseFloat(a.points)),
    });
  }

  render = () => (
    <div>
      {
        this.state.leaderboard.length>0
        ? this.state.leaderboard.map((team, i) => (
            <LBList
              key={ i }
              position={ i + 1 }
              title={ team.college.name }
              description={ team.college.location }
              points={ team.points }
            />
          ))
        : <h1 style={{textAlign:"center"}}>No results</h1>
      }
    </div>
  );
};
