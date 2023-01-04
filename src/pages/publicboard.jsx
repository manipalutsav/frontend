import React from "react";

import Layout from "../layouts/app";
import eventsService from '../services/events'
import leaderboardService from '../services/leaderboard';
import collegeService from '../services/colleges';
import { Button } from '../commons/Form';

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
  }
  componentWillMount() {
    this.init();
  }
  async init() {
    await this.setState({ status: "Fetching events..." });
    let events = await eventsService.getAll();
    events = events.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
    await this.setState({ status: "Fetching colleges", events });
    let colleges = await collegeService.getAll();
    colleges = colleges.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
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
      let leaderboard = await leaderboardService.getRound(event.id, event.rounds[0]);
      leaderboard = leaderboard.filter(team => !team.disqualified).sort((a, b) => b.points - a.points);
      let rankingPoints = Array.from(new Set(leaderboard.map(team => team.points)));
      leaderboard.forEach(team => {

        // #TODO, two teams of same college winning in one event.
        let rank = rankingPoints.indexOf(team.points);
        if (rank < 3) {
          set.push({
            college: team.team.college,
            event: event.id,
            rank: rank + 1
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
  render = () => (
    <Layout>
      <h1 className="mucapp"> Leaderboard</h1>
      <div className="no-print">
        {this.state.status}
        {this.state.showButton ? <Button onClick={this.sortByRank} styles={{ marginLeft: 20 }}>Sort By Rank</Button> : ''}
        {this.state.showButton ? <Button onClick={this.sortByName} styles={{ marginLeft: 20 }}>Sort By College Name</Button> : ''}
      </div>
      <div className="leaderboardContainer" style={{ overflow: "scroll" }}>
        <table className="leaderboard">
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
