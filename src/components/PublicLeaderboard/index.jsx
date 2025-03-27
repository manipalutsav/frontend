import React from "react";

import request from "../../utils/request.js";
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
      status: "...",
      events: [],
      colleges: [],
      set: [],
      total: []
    };
  }
  componentWillMount = () => {
    this.init();
  };

  async init() {
      await this.setState({ status: "Fetching events..." });
      let events = await eventsService.getAll();
      events = events.sort((a, b) => a.startDate < b.startDate ? -1 : (a.startDate > b.startDate ? 1 : 0));
      events = events.filter((ev)=>{
        return (remove_event_list.find(r_ev => r_ev == ev.name) == undefined);
      })
      await this.setState({ events });
      let colleges = await collegeService.getAll();
      colleges = colleges.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
      colleges = colleges.filter((college)=>{ // Filter out the colleges that shouldn't be in the leaderboard
        return (remove_college_list.find(r_college => r_college.name == college.name && r_college.location == college.location) == undefined);
      })
      await this.setState({ colleges });


      let set = [];
      let response = await request("/leaderboard/getleaderboard");
      set = response.data;
      this.setState({ set });

      let total = colleges.map(college => ({
        name: college.name,
        location: college.location,
        points: this.getTotal(college),
        rank: 0
      }));
      
      total.sort((a, b) => b.points - a.points);

      let rank = 1;
      for (let i = 0; i < total.length; i++) {
        if (i > 0 && total[i].points < total[i - 1].points) {
          rank++;
        }
        total[i].rank = rank;  
      }
      this.setState({  total , status: "Done"});
      console.log(total);
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
        {this.state.status !== "Done" ? <h1 style={{ textAlign: "center" }}>{this.state.status}</h1> :
          this.state.total.length
          ? this.state.total.map((college, i) => (
            <LBList
              main={false}
              key={i}
              position={college.rank}
              title={college.name}
              description={college.location}
              points={college.points}
            />
          ))
            : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
        
      }
      </div >
    </div >
  );
};
