import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from "../../services/leaderboard";
import eventsService from '../../services/events'
import collegeService from '../../services/colleges';
import { Button } from "../../commons/Form";
import { Link } from "gatsby";

const remove_college_list = [{name:"Cultural Coordination Committee", location:"Manipal"}, {name:"Kasturba Hospital", location:"Manipal"}, {name:"MAHE", location:"Manipal"}];
const remove_event_list = ["Staff Cooking: Vegetarian", "Staff Cooking: Non-Vegetarian", "Staff Cooking: Sweets and Desserts", "Staff Vegetable & Fruit Carving","Staff Variety Entertainment", "Poetry (Kannada)"];

export default class extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      events: [],
      colleges: [],
      set: [],
      rankDisplayData: [],
    };
  }

  getRank = (points) => {
    if (!this.state.leaderboard.length) return 0;

    let scores = Array.from(new Set(this.state.leaderboard.map(team => team.points)));
    return scores.indexOf(points) + 1;
  };

  componentWillMount = () => {
    leaderboardService.getPublic().then(lb =>
      this.setState({
        leaderboard: lb.sort((a, b) => parseFloat(b.points) - parseFloat(a.points)),
      })
    );
    this.init();
  };

  async init() {
      await this.setState({ status: "Fetching events..." });
      let events = await eventsService.getAll();
      events = events.sort((a, b) => a.startDate < b.startDate ? -1 : (a.startDate > b.startDate ? 1 : 0));
      events = events.filter((ev)=>{
        return (remove_event_list.find(r_ev => r_ev == ev.name) == undefined);
      })
      await this.setState({ status: "Fetching colleges", events });
      let colleges = await collegeService.getAll();
      colleges = colleges.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
      colleges = colleges.filter((college)=>{ // Filter out the colleges that shouldn't be in the leaderboard
        return (remove_college_list.find(r_college => r_college.name == college.name && r_college.location == college.location) == undefined);
      })
      await this.setState({ colleges });
      let set = [];
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.faculty)
          continue;
        let round = await eventsService.getRound(event.id, event.rounds[0]);
        if (!round.published)
          continue;
        await this.setState({ status: "Fetching  " + event.name + " leaderboard..." });
        //Fetch rounds leaderboard (only last)
        if (event.rounds.length == 0)
          continue;//skip if no rounds found
        let leaderboard = await leaderboardService.getRound(event.id, event.rounds[event.rounds.length - 1]);
        console.log(leaderboard, "leaderboard");
        //Get rank
        leaderboard.forEach(item => {
          // #TODO, two teams of same college winning in one event.
          if (item.rank <= 3) {
            set.push({
              college: item.slot.college,
              event: event.id,
              rank: item.rank
            });
          }
        });
        this.setState({ set })
      }
      let total = {};
      let highestTotal = 0;
      colleges.forEach(college => {
        let totalPoint = this.getTotal(college);
        if(totalPoint > highestTotal) highestTotal = totalPoint;
        total[college.name] = {location: college.location, points: totalPoint, rank: 0}
      })
      let rank = 1;
      
      let uniquePoints = [...new Set(Object.values(total).map(college => college.points))];
      uniquePoints.sort((a, b) => b - a); // Sort in descending order
      
      Object.values(total).forEach(college => {
        college.rank = uniquePoints.indexOf(college.points) + 1; // Rank starts from 1
      });
      let sortedArray = Object.entries(total).sort((a, b) => a[1].rank - b[1].rank);
      this.setState({ rankDisplayData: sortedArray });

    }

    getPoints(event, college) {
      let teams = this.state.set.filter(team => team.college._id === college.id && team.event === event.id);
      
      let points = 0;
      teams.forEach(team => {
        if (event.maxMembersPerTeam > 1) {
          switch (team.rank) {
            case 1: points += 14; break;
            case 2: points += 10; break;
            case 3: points += 8; break;
            default: points += 0;
          }
        }
        else {
          switch (team.rank) {
            case 1: points += 10; break;
            case 2: points += 8; break;
            case 3: points += 6; break;
            default: points += 0;
          }
        }
      });
  
      if (points > 0)
        return points;
      else
        return '';
    }
    getTotal(college) {
      let teams = this.state.set.filter(team => team.college._id === college.id);
      let points = 0;
      teams.forEach(team => {
        let event = this.state.events.find(event => event.id === team.event);
        if (event.maxMembersPerTeam > 1) {
          switch (team.rank) {
            case 1: points += 14; break;
            case 2: points += 10; break;
            case 3: points += 8; break;
            default: points += 0;
          }
        }
        else {
          switch (team.rank) {
            case 1: points += 10; break;
            case 2: points += 8; break;
            case 3: points += 6; break;
            default: points += 0;
          }
        }
      });
      return points;
    }


  render = () => (
    <div>
      <div css={{ textAlign: "center" }}>
        <h1 className="mucapp"> College Leaderboard</h1>
        <Link to="/publicboard"><Button>View Table</Button></Link>
      </div>
      <div>
        {
          this.state.leaderboard.length
            ? this.state.rankDisplayData.map(([collegeName, team], i) => (
              <LBList
                main={false}
                key={i}
                position={team.rank}  
                title={collegeName}   
                description={team.location}  
                points={team.points}  
              />
            ))
            : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
        }
      </div >
    </div >
  );
};
