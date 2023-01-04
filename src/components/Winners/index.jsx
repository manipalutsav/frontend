import React from "react";

import collegesService from "../../services/colleges";
import leaderboardService from "../../services/leaderboard";
import Loader from "../../commons/Loader";

const styles = {
  teamCard: {
    display: "inline-block",
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    width: 250,
    borderRadius: 3,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
    transition: "box-shadow .2s ease",
    ":hover": {
      color: "inherit",
      boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
    }
  },
};

const Member = (props) => (
  <div css={styles.teamCard}>
    <div>{props.name}</div>
    <div css={{
      fontSize: "0.8em",
      color: "#ff5800",
    }}>{props.team}</div>
  </div>
);

const College = (props) => (
  <div>
    <h2 className="mucapp">{props.info.name + ", " + props.info.location}</h2>
    <div>
      {
        props.winners && props.winners.map((winner) => (
          <div>
            <h3 className="mucapp">{winner.team && winner.team.event.name} - {winner.rank + (winner.rank === 1 ? "st" : winner.rank === 2 ? "nd" : winner.rank === 3 ? "rd" : "th")} Prize</h3>
            <div>
              {
                winner && winner.team && winner.team.members.map((member, i) => (
                  <Member
                    key={i}
                    name={member.name}
                    team={winner.team.name.match(/Team ./i)[0]}
                  />
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

const CollegeList = (props) => (
  <div>
    {
      props.colleges
        ? props.colleges.map((college, i) => (
          <College
            key={i}
            info={college}
            winners={props.winners && props.winners.filter(winner => winner.team.college && winner.team.college._id === college.id)}
          />
        ))
        : null
    }
  </div>
);

export default class Colleges extends React.Component {
  state = {
    colleges: [],
    winners: [],
  };

  componentWillMount() {
    leaderboardService.getWinners().then(winners => {
      collegesService.getAll().then(colleges => {
        let winningColleges = winners.map(winner => winner.team.college && winner.team.college._id);
        colleges = colleges.filter(college => winningColleges.includes(college.id));
        this.setState({ colleges, winners });
      });
    });
  }

  render = () => (
    <div>
      <h2 className="mucapp">Winners</h2>
      <p>Winners of Utsav 2019.</p>
      <div>
        {
          this.state.winners.length
            ? <CollegeList
              colleges={this.state.colleges} winners={this.state.winners}
            />
            : <Loader />
        }
      </div>
    </div>
  );
};
