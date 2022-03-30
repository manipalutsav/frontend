import React from 'react';
import { RoundCard } from '../../commons/Card';
import { getRounds } from '../../actions/eventActions';
import store from '../../reducers/commonReducer';
import eventsService from "../../services/events";
import { Link } from "gatsby";


export default class Rounds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      rounds: [],
    };
  }

  componentWillMount = () => {
    eventsService.get(this.props.event).then(event =>
      this.setState({ event })
    );

    getRounds(this.props.event);
    store.subscribe(() => {
      store.getState().then(state =>
        this.setState({
          rounds: state.data.list,
        })
      );
    });
  }

  handleDelete = (roundID) => {
    // let surity = typeof window !== "undefined" && window.confirm("Are you sure you want to delete this round?");

    // if (surity) {
    //   eventsService.deleteRound(this.props.event, roundID);
    // }
  }

  render = () => (
    <div>
      {
        this.state.event
          ? <>
            <div>
              <h2>{this.state.event.name}</h2>
              <p>
                {this.state.event.faculty ? "Faculty Event" : "Student Event"} organized by {this.state.event.college && this.state.event.college.name + ", " + this.state.event.college.location}
              </p>
            </div>
            <div>
              <div>
                <h3>Rounds</h3>
                <Link to="add"><button>Add Event</button></Link>
                <p>A total of {this.state.event.rounds && this.state.event.rounds.length} rounds are there.</p>
              </div>
              <div>
                {
                  this.state.rounds.map((each, i) =>
                    <RoundCard
                      key={i}
                      type={1}
                      eventId={each.event}
                      roundId={each.id}
                      title={`Round ${i + 1}`}
                      onClick={this.handleDelete}
                    />
                  )
                }
              </div>
            </div>
          </>
          : null
      }
    </div>
  );
}
