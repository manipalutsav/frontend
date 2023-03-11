import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import collegeService from '../../services/colleges';
import { Button } from "../../commons/Form";
import { Link } from "gatsby";
import { getTeamName } from "../../utils/common";
import Block from '../../commons/Block'
import Loader from "../../commons/Loader";

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
      loading: true
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
      let teams = await eventService.getTeams(this.props.event);
      let participants = [];
      await Promise.all(leaderboard.map(async item => {
        let _participants = await collegeService.getParticipants(item.slot.college._id);
        participants = participants.concat(_participants);
      }))
      console.log({ participants })
      teams = teams.map(team => ({ ...team, participants: team.members.map(id => participants.find(participant => participant.id == id)) }))
      leaderboard = leaderboard.map(item => ({ ...item, team: teams.find(team => team.college._id == item.slot.college._id && team.index == item.slot.teamIndex) }))

      console.log({ leaderboard });
      this.setState({ event, round, leaderboard, published: round.published, loading: false })
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
        <Block show={this.state.loading}>
          <Loader />
        </Block>
        <Block show={!this.state.loading}>
          {
            this.state.leaderboard.length
              ? <>
                {
                  this.state.leaderboard.map((item, i) => (
                    <LBList
                      key={i}
                      position={item.rank}
                      title={getTeamName(item.slot)}
                      description={
                        item.team.participants.length < 3 ? (item.team.participants.map((participant, key) => <div key={key}><small className="text-xs">{participant.registrationID}</small> {participant.name}</div>)) :
                          <details>
                            <summary>View Team</summary>
                            {(item.team.participants.map((participant, key) => <div key={key}><small className="text-xs">{participant.registrationID}</small> {participant.name}</div>))}                         </details>
                      }
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
        </Block>
      </div >
    </div >
  );
};
