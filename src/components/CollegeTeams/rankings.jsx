import React from "react";
import { Link } from "gatsby";

import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";
import LoadContent from "../../commons/LoadContent";
import { isTeamChangeFreezed } from "../../utils/common";


export default class Teams extends React.Component {
  state = {
    showLoader: true,
    ranks: [],
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    let user = getUser();
    let response = await collegesService.getPublishedEventRankings(user.college);
    let college = await collegesService.get(user.college);
    console.log(response);
    this.setState({ ranks: response, college, showLoader: false })

  }

  ordinal_suffix_of(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
  }

  render = () => (<LoadContent loading={this.state.showLoader}>
    <div>
      <h2 className="mucapp">{this.state.college ? (this.state.college.name + " " + this.state.college.location) : ""}</h2>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Event name</th>
          <th>Ranks</th>
        </tr>
      </thead>
      <tbody>
        {this.state.ranks.filter((eventRanks)=>eventRanks.event.faculty==false).map(eventRanks => {
          console.log(eventRanks)
          return <tr>
          <td><Link to={`/events/${eventRanks.event._id}/rounds/${eventRanks.event.rounds.pop()}/leaderboard`}>{eventRanks.event.name}</Link></td>
          {/* uncomment this to show ranks to public */}
          <td>{eventRanks.ranks.map(rank => <span className="pr-5">{this.ordinal_suffix_of(rank.rank)}</span>)}</td>
        </tr>
        })}
      </tbody>
    </table>
  </LoadContent>)
};
