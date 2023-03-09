import React from "react";

import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import Top from "../../images/top.png"
import Bottom from "../../images/bottom.png"
import { Button } from "../../commons/Form";
import { getTeamName } from "../../utils/common";

const html2canvas = typeof window !== `undefined` ? require("html2canvas") : null

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.download = this.download.bind(this);
    this.resize = this.resize.bind(this);
    this.state = {
      event: {},
      leaderboard: [],
      published: false,
      ranks: { 1: [], 2: [], 3: [] },
      button: this.BUTTON_NORMAL,
      width: 1000
    };
  }

  getRank = (points) => {
    if (!this.state.teams.length) return 0;

    let scores = Array.from(new Set(this.state.teams.map(team => team.total)));
    return scores.indexOf(points) + 1;
  };

  componentWillMount = async () => {
    let event = await eventService.get(this.props.event);

    let leaderboard = await leaderboardService.getRound(this.props.event, this.props.round);

    let ranks = this.state.ranks;

    ranks[1] = leaderboard.filter(item => item.rank == 1);
    ranks[2] = leaderboard.filter(item => item.rank == 2);
    ranks[3] = leaderboard.filter(item => item.rank == 3);
    this.setState({ leaderboard, event });

  }

  resize(event) {
    let leaderboard = document.querySelector("#leaderboardContainer");
    event.target.innerHTML = "Done";
    event.target.disabled = true;
    this.setState({ width: leaderboard.offsetHeight });
  }
  async componentDidMount() {

    //document.body.appendChild(canvas);
  }
  async download() {
    let leaderboard = document.querySelector("#leaderboardContainer");
    let canvas = await html2canvas(leaderboard);
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("A");
    a.href = data;
    a.download = this.state.event.name;
    a.click();
  }
  render = () => (
    <>
      <div id="leaderboardContainer" style={{ width: this.state.width, margin: "auto" }}>
        <div id="leaderboard" css={{ maxWidth: 1000, background: "#eae8e3", margin: "auto" }}>
          <img src={Top} alt="top" style={{ width: "100%" }} />
          <h1 className="mucapp" css={{ color: "#900", fontSize: "3em", fontFamily: "'Cinzel Decorative', cursive", textAlign: "center" }} > {this.state.event.name}</h1>
          <div css={{ textAlign: "center" }}>
            <h2 css={{ color: "#900" }}>FIRST POSITION</h2>
            {
              this.state.ranks[1].map((leaderboardItem, index) => <h3 key={index}>{getTeamName(leaderboardItem.slot)}</h3>)
            }
          </div>

          <div css={{ textAlign: "center" }}>
            <h2 css={{ color: "#900" }}>SECOND POSITION</h2>
            {
              this.state.ranks[2].map((leaderboardItem, index) => <h3 key={index}>{getTeamName(leaderboardItem.slot)}</h3>)
            }
          </div>

          <div css={{ textAlign: "center" }}>
            <h2 css={{ color: "#900" }}>THIRD POSITION</h2>
            {
              this.state.ranks[3].map((leaderboardItem, index) => <h3 key={index}>{getTeamName(leaderboardItem.slot)}</h3>)
            }
          </div>
          <img src={Bottom} alt="top" style={{ width: "100%" }} />
        </div>
      </div>
      <div style={{ textAlign: "center", padding: 20 }}>
        <Button onClick={this.resize} styles={{ marginRight: 100 }}>Square Image</Button>
        <Button onClick={this.download}>Download</Button>
      </div>

    </>
  );
};
