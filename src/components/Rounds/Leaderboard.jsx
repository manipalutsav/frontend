import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import { Button } from "../../commons/Form";
import { Link } from "gatsby";
import { getTeamName } from "../../utils/common";

export default class extends React.Component {
  BUTTON_NORMAL = "Publish";
  BUTTON_CLICKED = "Publishing...";

  constructor(props) {
    super(props);

    this.handlePublish = this.handlePublish.bind(this);
    this.state = {
      event: {},
      leaderboard: [],
      published: false,
      button: this.BUTTON_NORMAL,
    };
  }

  getRank = (points) => {
    if (!this.state.leaderboard.length) return 0;

    let scores = Array.from(new Set(this.state.leaderboard.map(team => team.points))).sort((a, b) => b - a);
    return scores.indexOf(points) + 1;
  };

  componentWillMount = () => {
    eventService.get(this.props.event).then(event => this.setState({ event }));

    leaderboardService.getRound(this.props.event, this.props.round).then(lb => {
      this.setState({
        leaderboard: lb.sort((a, b) => parseFloat(b.points) - parseFloat(a.points)),
      });
    });

    eventService.getRound(this.props.event, this.props.round).then(round => this.setState({ published: round.published }));

    leaderboardService.getRound(this.props.event, this.props.round).then(leaderboard => {
      this.setState({
        leaderboard: leaderboard.filter(slot => !slot.disqualified).sort((a, b) => parseFloat(b.points) - parseFloat(a.points)),
      });
    });
  }

  handlePublish = () => {
    this.setState({ button: this.BUTTON_CLICKED });

    eventService.publishRoundLeaderboard(this.props.event, this.props.round).then(status =>
      this.setState({
        published: !!status,
        button: this.BUTTON_NORMAL,
      })
    );
  }

  render = () => (
    <div>
      <div>
        <h1 style={{ textAlign: "center" }}>{this.state.event.name}</h1>
        <h2 style={{ textAlign: "center" }}>Round {this.state.event.rounds && this.state.event.rounds.indexOf(this.props.round) + 1} Leaderboard</h2>
      </div>
      <div>
        {
          this.state.leaderboard.length
            ? <>
              {
                this.state.leaderboard.map((slot, i) => (
                  <LBList
                    key={i}
                    position={this.getRank(slot.points)}
                    title={getTeamName(slot.team)}
                    description={""}
                    points={slot.points}
                  />
                ))
              }
              <div style={{ textAlign: "center", padding: 20 }}>
                {
                  this.state.published
                    ? <>
                      <div style={{ color: "#090" }}>Published</div>
                    </>
                    : <Button
                      onClick={this.handlePublish}
                      disabled={this.state.button === this.BUTTON_CLICKED}
                    >
                      {this.state.button}
                    </Button>
                }
                <Link to={`/events/${this.props.event}/rounds/${this.props.round}/leaderboard/download`}><Button styles={{ marginLeft: 20 }}>Download</Button></Link>
              </div>
            </>
            : <h1 style={{ textAlign: "center" }}>No results</h1>
        }
      </div>
    </div>
  );
};
