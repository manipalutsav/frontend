import React from "react";

import leaderboardService from '../../services/leaderboard';
import eventService from '../../services/events';
import Top from "../../images/top.png"
import Bottom from "../../images/bottom.png"
import { Button } from "../../commons/Form";
import collegesService from '../../services/colleges';

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
      ranks: {1:[],2:[],3:[]},
      button: this.BUTTON_NORMAL,
      width:1000
    };
  }

  getRank = (points) => {
    if (!this.state.teams.length) return 0;

    let scores = Array.from(new Set(this.state.teams.map(team => team.total)));
    return scores.indexOf(points) + 1;
  };

  componentWillMount = async () => {
    let event = await eventService.get(this.props.event);

    await this.setState({ event });

    let slots = await eventService.getSlots(this.props.event, this.props.round);

    let lb = await leaderboardService.getRound(this.props.event,this.props.round);

    if (!lb.length) return;

    let teams = slots;
    for (let team of teams) {
      let score = lb.find(score => score.team._id === team.team._id);

      team.points = score.judgePoints || 0;
      // team.points = score.points || 0;
      team.overtime = score.overtime || 0;
      team.bias = score.bias;
      team.total = score.points;
    }
    teams=teams.filter(slot => !slot.team.disqualified).sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
    let scores = Array.from(new Set(teams.map(team => team.total))).sort((a,b)=>b-a);

    this.setState({teams}, async ()=>{
      let ranks=this.state.ranks;


      for(let i=0;i<teams.length;i++){
        let team=teams[i];
        let rank = scores.indexOf(team.total)+1;

        if(rank>=1&&rank<=3){
          let name = <>{"#"+team.number+" "+team.team.name.match(/[\w\s-]+/)[0]}</>;

          if(team.team.members.length===1){
            let participants = await collegesService.getParticipants(team.team.college)
            let participant=participants.find(participant=>team.team.members.includes(participant.id));
            name = <>{"#"+team.number+" "+participant.name}<br/><small>{team.team.name.match(/[\w\s-]+/)[0]}</small></>;
          }
          ranks[rank].push(name);


        }
      }

      await this.setState({  scoreStatus: true,ranks });
    });
  }
  resize(event){
    let leaderboard = document.querySelector("#leaderboardContainer");
    event.target.innerHTML="Done";
    event.target.disabled=true;
    this.setState({width:leaderboard.offsetHeight});
  }
  async componentDidMount(){

    //document.body.appendChild(canvas);
  }
  async download(){
    let leaderboard = document.querySelector("#leaderboardContainer");
    let canvas = await html2canvas(leaderboard);
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("A");
    a.href=data;
    a.download=this.state.event.name;
    a.click();
  }
  render = () => (
    <>

    <div id="leaderboardContainer" style={{width:this.state.width,margin:"auto"}}>
      <div id="leaderboard" css={{maxWidth:1000,background: "#eae8e3",margin:"auto"}}>
        <img src={Top} alt="top" style={{width:"100%"}}/>
        <h1 css={{color:"#900",fontSize:"3em",fontFamily:"'Cinzel Decorative', cursive",textAlign:"center"}}>{this.state.event.name}</h1>
        <div css={{textAlign:"center"}}>
          <h2 css={{color:"#900"}}>FIRST POSITION</h2>
          {
            this.state.ranks[1].map((i,j)=><h3 key={j}>{i}</h3>)
          }
        </div>
        <div css={{textAlign:"center"}}>
          <h2 css={{color:"#900"}}>SECOND POSITION</h2>
          {
            this.state.ranks[2].map((i,j)=><h3 key={j}>{i}</h3>)
          }
        </div>
        <div css={{textAlign:"center"}}>
          <h2 css={{color:"#900"}}>THIRD POSITION</h2>
          {
            this.state.ranks[3].map((i,j)=><h3 key={j}>{i}</h3>)
          }
        </div>
        <img src={Bottom} alt="top" style={{width:"100%"}}/>
      </div>
    </div>
    <div style={{textAlign:"center",padding:20}}>
      <Button onClick={this.resize} styles={{marginRight:100}}>Square Image</Button>
      <Button onClick={this.download}>Download</Button>
    </div>

    </>
  );
};
