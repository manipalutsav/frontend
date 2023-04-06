import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import collegeService from '../../services/colleges';
import { Button } from "../../commons/Form";
import { Link } from "gatsby";
import { getCertificateName, getTeamName } from "../../utils/common";
import Block from '../../commons/Block'
import Loader from "../../commons/Loader";

import one_x_one__two_x_one__three_x_one from '../../images/1x1_2x1_3x1.png'
import one_x_one__two_x_one__three_x_two from '../../images/1x1_2x1_3x2.png'
import one_x_one__two_x_one__three_x_three from '../../images/1x1_2x1_3x3.png'

import one_x_one__two_x_two__three_x_one from '../../images/1x1_2x2_3x1.png'
import one_x_one__two_x_two__three_x_two from '../../images/1x1_2x2_3x2.png'
import one_x_one__two_x_two__three_x_three from '../../images/1x1_2x2_3x3.png'

import one_x_one__two_x_three__three_x_one from '../../images/1x1_2x3_3x1.png'
import one_x_one__two_x_three__three_x_two from '../../images/1x1_2x3_3x2.png'
import one_x_one__two_x_three__three_x_three from '../../images/1x1_2x3_3x3.png'

import one_x_two__two_x_one__three_x_one from '../../images/1x2_2x1_3x1.png'
import one_x_two__two_x_one__three_x_two from '../../images/1x2_2x1_3x2.png'
import one_x_two__two_x_one__three_x_three from '../../images/1x2_2x1_3x3.png'

import one_x_two__two_x_two__three_x_one from '../../images/1x2_2x2_3x1.png'
import one_x_two__two_x_three__three_x_one from '../../images/1x2_2x3_3x1.png'
import one_x_three__two_x_three__three_x_three from '../../images/1x3_2x3_3x3.png'

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

   async download() {
    let leaderboard = this.state.leaderboard;
    let ranks = {1: [], 2: [], 3: []}

    ranks[1] = leaderboard.filter(item => item.rank == 1);
    ranks[2] = leaderboard.filter(item => item.rank == 2);
    ranks[3] = leaderboard.filter(item => item.rank == 3);

    let event = await eventService.get(this.props.event);
    const is_group_event = event.maxMembersPerTeam > 1;
    event = event.name;

    const placesArray = [
      ranks[1].map(item => ({ 
        name: getCertificateName(item, is_group_event),
      })),
      ranks[2].map(item => ({ 
        name: getCertificateName(item, is_group_event),
      })),
      ranks[3].map(item => ({ 
        name: getCertificateName(item, is_group_event),
      }))
    ];

    let event_font_size = "35.4";

    const image = new Image();

    let first_start = 460;
    let second_start = 640;
    let third_start = 820;
    let bold = false;
    // Only 1 team in each place
    if(placesArray[0].length == 1 && placesArray[1].length == 1 && placesArray[2].length == 1){ 
      image.src = one_x_one__two_x_one__three_x_one;
      bold = true;
    } 
    // 3 teams tied in each place
    else if(placesArray[0].length == 3 && placesArray[1].length == 3 && placesArray[2].length == 3){
      image.src = one_x_three__two_x_three__three_x_three;
      first_start = 480;
      second_start = 700;
      third_start = 925;
    }
    // TODO: More cases

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const link = document.createElement('a');
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
      context.font = event_font_size + "px Algerian";
      context.fillStyle = "#000000";
      context.textAlign = "left";
      context.fillText(event + " Results", (canvas.width / 2.57), 360);
      if(bold) {
        context.font = "bold 26px Verdana";
      } else {
        context.font = "26px Verdana";
      }
      for (let i = 0; i < placesArray[0].length; i++) {
        let text = placesArray[0][i]["name"];
        context.fillText(text, (canvas.width / 3.1), first_start + (i * 40));
      }
      for (let i = 0; i < placesArray[1].length; i++) {
        let text = placesArray[1][i]["name"];
        context.fillText(text, (canvas.width / 3.1), second_start + (i * 40));
      }
      for (let i = 0; i < placesArray[2].length; i++) {
        let text = placesArray[2][i]["name"];
        context.fillText(text, (canvas.width / 3.1), third_start + (i * 40));
      }
      canvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.download = event + "-leaderboard.png"
        link.style.display = "none";
        document.body.append(link);
        link.click();
        link.remove();
      }, 'image/png');
    };

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
      teams = teams.map(team => ({ ...team, participants: team.members.map(id => participants.find(participant => participant.id === id)) }))
      leaderboard = leaderboard.map(item => ({ ...item, team: teams.find(team => team.college._id === item.slot.college._id && team.index === item.slot.teamIndex) }))

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
                  this.state.leaderboard.map((item, i) => (<Leaderboard item={item} key={i} />
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
                  <button onClick={() => this.download()}>Download</button>
                  {/* <Link to={`/events/${this.props.event}/rounds/${this.props.round}/leaderboard/download`}><Button styles={{ marginLeft: 20 }}>Download</Button></Link> */}
                </div>
              </>
              : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
          }
        </Block>
      </div >
    </div >
  );
};

const Leaderboard = ({ item, key }) => (
  item.team.participants.length == 1 ? (
    <LBList
      key={key}
      position={item.rank}
      title={item.team.participants[0].name}
      description={<div>
        <div>{item.team.participants[0].registrationID}</div>
        <div>#{item.slot.number} - {getTeamName(item.slot)}</div>
      </div>}
      points={item.total}
    />
  ) : (
    <LBList
      key={key}
      position={item.rank}
      title={getTeamName(item.slot)}
      description={
        <div>
          <div>#{item.slot.number}</div>
          <details>
            <summary>View Team</summary>
            {(item.team.participants.map((participant, key) => <div key={key}><small className="text-xs">{participant.registrationID}</small> {participant.name}</div>))}
          </details>
        </div>
      }
      points={item.total}
    />)
);