import React from "react";

import Layout from "../layouts/app";
import eventsService from '../services/events'
import leaderboardService from '../services/leaderboard';
import collegeService from '../services/colleges';
import { Button } from '../commons/Form';
import ReactDOMServer from 'react-dom/server';

import "./index.css"

const remove_college_list = [{name:"Cultural Coordination Committee", location:"Manipal"}, {name:"Kasturba Hospital", location:"Manipal"}, {name:"MAHE", location:"Manipal"}];
const remove_event_list = ["Staff Cooking: Vegetarian", "Staff Cooking: Non-Vegetarian", "Staff Cooking: Dessert", "Staff Vegetable & Fruit Carving", "Staff Variety Entertainment", "Poetry (Kannada)","Quiz"];
// const remove_event_list = ["Some event", "Hello World"]; // Testing
export default class extends React.Component {
  state = {
    status: "...",
    events: [],
    colleges: [],
    set: [],
    total: {}
  }
  constructor(props) {
    super(props);
    this.getPoints = this.getPoints.bind(this);
    this.sortByRank = this.sortByRank.bind(this);
    this.sortByName = this.sortByName.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
    this.tableJSX = this.tableJSX.bind(this);
  }
  componentWillMount() {
    this.init();
  }
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
    colleges.forEach(college => {
      total[college.id] = this.getTotal(college);
    })
    this.setState({ status: "Done", showButton: true, total });
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
  sortByRank() {
    let colleges = this.state.colleges.sort((a, b) => this.state.total[b.id] - this.state.total[a.id]);
    this.setState({ colleges });
  }
  sortByName() {
    let colleges = this.state.colleges.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
    this.setState({ colleges });
  }
  tableJSX = ()=>{
    return (<div className="leaderboard-containter-pdf">
    <table className="leaderboard" style={{width: "100%", }}>
      <thead>
        <tr>
          <th>&nbsp;</th>
          {this.state.events.map((event, index) => <th key={index}>{event.name}</th>)}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {
          this.state.colleges.map((college, index) =>
            <tr key={index}>
              <th>{college.name},{college.location}</th>
              {this.state.events.map((event, index) => <th key={index}>{this.getPoints(event, college)}</th>)}
              <th>{this.getTotal(college)}</th>
            </tr>)
        }
        
      </tbody>
    </table>
  </div>)
  }
  generatePDF(){
    const tableJSX = ReactDOMServer.renderToString(this.tableJSX());
    const style = `
       <style>
          @media print{@page {size: landscape}}
          body{
            font-family: sans-serif;
          }
          .leaderboard th{
            width: 100px;
            border: 1px solid #000;
            padding: 5px;
          } 

          table{
            border-collapse: collapse !important;
          }

          tr:nth-child(odd){
            background-color: #eee;
          }
       </style>
    `
    // const opt = {
    //   jsPDF: {
    //     format: 'a3',
    //     orientation: 'landscape',
        
    //   },
    //   pagebreak: {mode:"avoid-all"},
    //   html2canvas:  { scale: 4, },
    //   margin: 1,
    //   image: {type: 'jpeg', quality: 0.98},
    //   filename: 'overall_leaderboard.pdf'
    // }
    // html2pdf().set(opt).from(tableJSX).save();
    if(typeof window != "undefined"){
      const printWindow = window.open("","Utsav 2023","width=1485mm,height=550mm");
            
            printWindow.document.write("<html><head><title>Utsav 2023</title>");
            printWindow.document.write(style);
            printWindow.document.write("</head><body>");
            printWindow.document.write(tableJSX);
            printWindow.document.write("</body></html>");
            printWindow.document.close();

            // printWindow.close();
            printWindow.print();
    }
  }
  render = () => (
    <Layout>
      <h1 className="mucapp"> Leaderboard</h1>
      <div className="no-print">
        {this.state.status}
        {this.state.showButton ? <Button onClick={this.sortByRank} styles={{ marginLeft: 20 }}>Sort By Rank</Button> : ''}
        {this.state.showButton ? <Button onClick={this.sortByName} styles={{ marginLeft: 20 }}>Sort By College Name</Button> : ''}
        <Button onClick={this.generatePDF} styles={{ marginLeft: 20 }}>Generate PDF</Button>
      </div>
      <div className="leaderboardContainer">
        <table className="leaderboard" style={{ overflow: "scroll" }}>
          <thead>
            <tr>
              <th>&nbsp;</th>
              {this.state.events.map((event, index) => <th key={index}>{event.name}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.colleges.map((college, index) =>
                <tr key={index}>
                  <th>{college.name},{college.location}</th>
                  {this.state.events.map((event, index) => <th key={index}>{this.getPoints(event, college)}</th>)}
                  <th>{this.getTotal(college)}</th>
                </tr>)
            }
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
