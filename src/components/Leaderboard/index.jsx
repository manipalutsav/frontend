import React from "react";

import LBList from "../../commons/LBList";
import leaderboardService from "../../services/leaderboard";
import { Link } from "gatsby";
import { Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";
import Certificates from "../Certificates";

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
      published: false,
    };
  }

  handlePublish = () => {
    let leaderboard = this.state.leaderboard.map(college => ({
      college: college._id,
      points: college.points,
    }));

    leaderboardService.publish(leaderboard).then(lb =>
      this.setState({ published: !!lb })
    );
  };

  componentWillMount = async () => {
    try {
      let leaderboard = await leaderboardService.get();
      this.setState({ leaderboard });
    } catch (error) {
      toast(error)
    }
  };

  render = () => (
    <div>
      {console.log(this.state)}
      <div css={{ textAlign: "center" }}>
        <h1 className="mucapp">College Leaderboard</h1>
        <div>
          <Link to="/board"><Button>View Table</Button></Link>
          {
            this.state.published
              ? "Published"
              : <button className="mucapp" style={{ marginLeft: 20 }} onClick={this.handlePublish}>Publish</button>
          }
        </div>
      </div>
      <div>
        {
          this.state.leaderboard.length > 0
            ? this.state.leaderboard.map((college, index) => (
              <LBList
                main={false}
                key={index}
                position={college.rank}
                title={college.name}
                description={college.location}
                points={college.points}
              />
            ))
            : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
        }
      </div>
    </div>
  );
};
