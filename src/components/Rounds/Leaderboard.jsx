import React from 'react';

import LBList from '../../commons/LBList';
import Dialog from '../../commons/Dialog';
import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import collegeService from '../../services/colleges';
import { Button } from '../../commons/Form';
import { Link } from 'gatsby';
import {
  getCertificateName,
  getTeamName,
  toTitleCase,
} from '../../utils/common';
import Block from '../../commons/Block';
import Loader from '../../commons/Loader';

import './style.css';
import template from '../../images/template2025.jpg';
export default class extends React.Component {
  BUTTON_NORMAL = 'Publish';
  BUTTON_CLICKED = 'Publishing...';

  constructor(props) {
    super(props);

    this.handlePublish = this.handlePublish.bind(this);
    this.state = {
      event: {},
      leaderboard: [],
      published: false,
      button: this.BUTTON_NORMAL,
      loading: true,
      EventType: true, //true is for group and false for solo
      consolation : 0,
      consolationDialog: false,
      isConsolationSet: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  async download(shareOption) {
    let eventName = "Staff Variety Entertainment";
    // Check if consolation prizes are set and its only tested for a specific event.
    if (this.state.isConsolationSet === false && this.state.event.name == eventName) {
      this.setState({ consolationDialog: true });

      // Wait for dialog to close before continuing so that before dialog is closed, image is not generated.
      await new Promise((resolve) => {
          this.resolveDialog = resolve;
      });
    }

    let leaderboard = this.state.leaderboard;
    console.log(leaderboard);
    let ranks = { 1: [], 2: [], 3: [] };
    let consolation = { 4: [] , 5: [] , 6: [] , 7: []}

    ranks[1] = leaderboard.filter((item) => item.rank == 1);
    ranks[2] = leaderboard.filter((item) => item.rank == 2);
    ranks[3] = leaderboard.filter((item) => item.rank == 3);
    
  

    
    // Adding consolation prizes to ranks array.
    if( this.state.event.name == eventName && this.state.isConsolationSet === true){
      for(let i = 4; i <= Number(this.state.consolation) + 3 && i <= this.state.leaderboard.length ; i++){
        consolation[i] = leaderboard.filter((item) => item.rank == i);
      }
    }
    console.log(consolation); 

    let event = await eventService.get(this.props.event);
    const is_group_event = event.maxMembersPerTeam > 1;
    const is_multiple_team_event = event.maxTeamsPerCollege > 1;
    event = event.name;

    //should be converted to const
    let placesArray = [
      ranks[1].map((item) => ({
        name: getCertificateName(item, is_group_event, is_multiple_team_event),
      })),
      ranks[2].map((item) => ({
        name: getCertificateName(item, is_group_event, is_multiple_team_event),
      })),
      ranks[3].map((item) => ({
        name: getCertificateName(item, is_group_event, is_multiple_team_event),
      })),
    ];
    
    //Adding certificate names for consolation prizes.
    if( this.state.event.name == eventName && this.state.isConsolationSet === true){
      for(let i = 4; i <= Number(this.state.consolation) + 3 ; i++){
        placesArray[i - 1] = consolation[i].map((item) => ({
          name: getCertificateName(item, is_group_event, is_multiple_team_event),
        }));
        
      }
    }
    console.log(placesArray);
    
    const image = new Image();
    image.src = template;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const link = document.createElement('a');

    image.onload = () => {
      canvas.width = 1080;
      canvas.height = 1536;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';

      // Title
      context.font = 'bold 40px Verdana';

      if(event.length >= 25){
        context.font = 'bold 35px Verdana';
      }


      // Setting shadow properties
      context.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color with transparency
      context.shadowBlur = 10; // Blur intensity
      context.shadowOffsetX = 5; // Horizontal shadow offset
      context.shadowOffsetY = 5; // Vertical shadow offset


      let textStr = event + ' Results';
      context.fillText(textStr.toUpperCase(), canvas.width / 2, 540);

      // Reset shadow properties to remove the effect
      context.shadowColor = "transparent"; 
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;


      // Dynamic font size. Not checking this for consolation prize as staff veriety entertainment has only 1 team per college.
      let maxTeams = Math.max(
        placesArray[0].length,
        placesArray[1].length,
        placesArray[2].length
      );
      let baseFontSize = Math.max(20, 60 - maxTeams * 10);
      context.font = `bold ${baseFontSize}px Hagrid-Regular`;
      context.textAlign = 'left';

      // Dynamic starting positions
      let first_start = 650 - placesArray[0].length * 15;
      let second_start = 900 - placesArray[1].length * 15;
      let third_start = 1150 - placesArray[2].length * 15;

      if( this.state.event.name == eventName && this.state.isConsolationSet === true && this.state.consolation > 0){
        first_start = 650 - placesArray[0].length * 15;
        second_start = 820 - placesArray[1].length * 15;
        third_start = 1000 - placesArray[2].length * 15;
      }
      let spacing = baseFontSize + 10;

      // Rank labels
      context.font = `bold ${baseFontSize + 10}px HammersmithOne`; // Slightly bigger font for rank labels
      // Calculate the vertical center of each rank section
      let firstRankCenter =
        first_start +
        (placesArray[0].length > 0
          ? ((placesArray[0].length - 1) * spacing) / 2
          : 0);
      let secondRankCenter =
        second_start +
        (placesArray[1].length > 0
          ? ((placesArray[1].length - 1) * spacing) / 2
          : 0);
      let thirdRankCenter =
        third_start +
        (placesArray[2].length > 0
          ? ((placesArray[2].length - 1) * spacing) / 2
          : 0);

      // Position rank labels at the vertical center of their sections
      context.fillText('1', canvas.width / 10, firstRankCenter);
      context.fillText('2', canvas.width / 10, secondRankCenter);
      context.fillText('3', canvas.width / 10, thirdRankCenter);

      // Adjust text position for team names
      let textX = canvas.width / 6;

      // Render team names under their respective ranks
      context.font = `bold ${baseFontSize - 10 }px HammersmithOne`;

      placesArray[0].forEach((team, i) => {
        context.fillText(team.name, textX, first_start + i * spacing);
      });

      placesArray[1].forEach((team, i) => {
        context.fillText(team.name, textX, second_start + i * spacing);
      });

      placesArray[2].forEach((team, i) => {
        context.fillText(team.name, textX, third_start + i * spacing);
      });

      

      
      if( this.state.event.name == eventName && this.state.isConsolationSet === true && this.state.consolation > 0){
        context.fillText("Special Mentions", canvas.width / 8 , 1090);
        let countOfTeam = [placesArray[3], placesArray[4], placesArray[5], placesArray[6]].filter(Boolean).flat().length;
        let baseFontSizeForConsolation = Math.min(baseFontSize , Math.max(20, 60 - countOfTeam * 10));
        let baseConsolationFontSizeReductionFactor = (countOfTeam)* 4;
        let consolationStartReductionFactor = (countOfTeam) * 3.5;
        let consolationStart = 1100 - consolationStartReductionFactor;
        context.font = `normal ${baseFontSize-baseConsolationFontSizeReductionFactor}px HammersmithOne`;
        let consolationCount = 1;
        for(let i = 3; i < Number(this.state.consolation) + 3 ; i++){
          console.log(placesArray[i-1]);
          if(placesArray[i] != undefined){
            placesArray[i].forEach((team, j) => {
              console.log(i, j);
              context.fillText(team.name, textX, consolationStart + consolationCount * (spacing-10));
              consolationCount++;
            });
          }
        }
        
      }
      this.setState({ consolation: 0 , isConsolationSet : false});
      // Save or Share
      canvas.toBlob(async (blob) => {
        if (shareOption == 'download') {
          link.href = URL.createObjectURL(blob);
          link.download = event + '-leaderboard.png';
          link.style.display = 'none';
          document.body.append(link);
          link.click();
          link.remove();
        }
        // if( this.state.event.name == eventName && this.state.isConsolationSet === true && this.state.consolation > 0){
        //   shareOption = "Send";
        // }
        else if (navigator.share && shareOption == 'Send') {
          try {
            await navigator.share({
              files: [
                new File([blob], 'leaderboard.png', {
                  type: 'image/png',
                }),
              ],
              title: event + ' Results',
              text: 'Check out the leaderboard!',
            });
          } catch (error) {
            console.log('Error sharing:', error);
          }
        } 
        
      }, 'image/png');
    };
  }

  handleConsolationChange = (e) =>{
    let value = Number(e.target.value);
    // Ensure value is within the range [0, 4]
    if (value < 0) value = 0;
    if (value > 4) value = 4;
    this.setState({consolation: value });
  }

  handleSubmitDailogButton = () => {
    this.setState(
        {
            consolationDialog: false,
            isConsolationSet: true,
        },
        () => {
            if (this.resolveDialog) {
                this.resolveDialog(); // Continue execution after closing dialog
            }
        }
    );
  };


  handleCancelDailogButton = () =>{
    this.setState({consolationDialog: false});
  }



  init = async () => {
    try {
      let event = await eventService.get(this.props.event);
      console.log(event.name);
      this.setState({ EventType: event.maxMembersPerTeam > 1 ? true : false });
      let round = await eventService.getRound(
        this.props.event,
        this.props.round
      );
      let leaderboard = await leaderboardService.getRound(
        this.props.event,
        this.props.round
      );
      let teams = await eventService.getTeams(this.props.event);
      console.log(event.maxTeamsPerCollege, 'event');
      let participants = [];
      await Promise.all(
        leaderboard.map(async (item) => {
          let _participants = await collegeService.getParticipants(
            item.slot.college._id
          );
          participants = participants.concat(_participants);
        })
      );
      console.log({ participants });
      teams = teams.map((team) => ({
        ...team,
        participants: team.members.map((id) =>
          participants.find((participant) => participant.id === id)
        ),
      }));
      leaderboard = leaderboard.map((item) => ({
        ...item,
        team: teams.find(
          (team) =>
            team.college._id === item.slot.college._id &&
            team.index === item.slot.teamIndex
        ),
      }));

      console.log({ leaderboard });
      this.setState({
        event,
        round,
        leaderboard,
        published: round.published,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handlePublish = () => {
    this.setState({ button: this.BUTTON_CLICKED });

    eventService
      .publishRoundLeaderboard(this.props.event, this.props.round)
      .then((status) =>
        this.setState({
          published: !!status,
          button: this.BUTTON_NORMAL,
        })
      );
  };
  handleShare = (e) => {
    console.log(this.EventType, 'event type');
    this.download(e);
  };
  render = () => (
    <div>
      <Dialog title = "Enter consolation Prizes count" body ={
        <div>
        <label
          htmlFor="consolation"
          className="block text-sm font-medium text-gray-700"
        >
          Consolation Prizes
        </label>
        <input
          className="w-[90%] px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          type="number"
          name="consolation"
          id="consolation"
          value={this.state.consolation}
          onChange={this.handleConsolationChange}
          min = "0"
          max = "4"
        />
      </div>
      } 
      positiveButton={{
        label: 'Submit',
        handler: this.handleSubmitDailogButton,
      }}
      negativeButton={{
        label: 'Cancel',
        handler: this.handleCancelDailogButton,
      }}
      show={this.state.consolationDialog}/>
      <div>
      <div>
        <h1 className="mucapp" style={{ textAlign: 'center' }}>
          {this.state.event.name}
        </h1>
        <h2 style={{ textAlign: 'center', 'font-family': 'HammersmithOne' }}>
          Round{' '}
          {this.state.event.rounds &&
            this.state.event.rounds.indexOf(this.props.round) + 1}{' '}
          Leaderboard
        </h2>
        {/* Make sure browser loads the font */}
      </div>
      <div>
        <Block show={this.state.loading}>
          <Loader />
        </Block>
        <Block show={!this.state.loading}>
          {this.state.leaderboard.length ? (
            <>
              {this.state.leaderboard.map((item, i) => (
                <Leaderboard
                  item={item}
                  key={i}
                  EventType={this.state.EventType}
                />
              ))}
              <div style={{ textAlign: 'center', padding: 20 }}>
                {this.state.published ? (
                  <>
                    <div style={{ color: '#090' }}>
                      This leaderboard is now visible to everyone
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={this.handlePublish}
                    disabled={this.state.button === this.BUTTON_CLICKED}
                  >
                    {this.state.button}
                  </Button>
                )}
                <Button onClick={() => this.handleShare('download')}>
                  Download
                </Button>
                <Button onClick={() => this.handleShare('Send')}>Send</Button>
                {/* <select name="share" style={{"cursor":"pointer","padding":".5rem"}} id="share" onChange={this.handleShare}>
                    <option value="share">Share</option>
                    <option value="download">Download</option>
                    <option value="Send">Send</option>
                  </select> */}
                {/* <Link to={/events/${this.props.event}/rounds/${this.props.round}/leaderboard/download}><Button styles={{ marginLeft: 20 }}>Download</Button></Link> */}
              </div>
            </>
          ) : (
            <h1 className="mucapp" style={{ textAlign: 'center' }}>
              No results
            </h1>
          )}
        </Block>
      </div>
    </div>
    
    </div>
  );
}

const Leaderboard = ({ item, key, EventType }) =>
  !EventType ? (
    <LBList
      key={key}
      position={item.rank}
      title={toTitleCase(item.team.participants[0].name)}
      description={
        <div>
          <div>{item.team.participants[0].registrationID}</div>
          <div>
            #{item.slot.number} - {getTeamName(item.slot)}
          </div>
        </div>
      }
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
            {item.team.participants.map((participant, key) => (
              <div key={key}>
                <small className="text-xs">{participant.registrationID}</small>{' '}
                {participant.name}
              </div>
            ))}
          </details>
        </div>
      }
      points={item.total}
    />
);