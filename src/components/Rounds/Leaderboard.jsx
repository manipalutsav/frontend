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

  componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      let event = await eventService.get(this.props.event);
      let round = await eventService.getRound(this.props.event, this.props.round);
      let leaderboard = await leaderboardService.getRound(this.props.event, this.props.round);
      this.setState({ event, round, leaderboard, published: round.published })
    } catch (error) {
      console.log(error)
    }
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
        <h1 className="mucapp" style={{ textAlign: "center" }}>{this.state.event.name}</h1>
        <h2 style={{ textAlign: "center" }}>Round {this.state.event.rounds && this.state.event.rounds.indexOf(this.props.round) + 1} Leaderboard</h2>
      </div>
      <div>
        {
          this.state.leaderboard.length
            ? <>
              {
                this.state.leaderboard.map((item, i) => (
                  <LBList
                    key={i}
                    position={item.rank}
                    title={getTeamName(item.slot)}
                    description={""}
                    points={item.total}
                  />
                ))
              }
              <div style={{ textAlign: "center", padding: 20 }}>
                {
                  this.state.published
                    ? <>
                      <div style={{ color: "#090" }}>This leaderboard is now visible to everyone</div>
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
            : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
        }
      </div >
    </div >
  );
};
