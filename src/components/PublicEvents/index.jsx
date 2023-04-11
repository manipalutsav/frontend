import React from "react";

import events from "../../services/events";
import moment from 'moment'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      events: []
    }
  }

  componentWillMount() {
    events.getAll().then(events => {
      const searchParams = new URLSearchParams(this.props.search.slice(1));
      let date = searchParams.get("date");
      if (date) {
        let startTime = new Date(date).getTime()
        let endTime = startTime + (24 * 60 * 60 * 1000)

        events = events.filter(event => startTime <= new Date(event.startDate).getTime() && new Date(event.startDate).getTime() <= endTime)
      }
      this.setState({ events, loaded: true })
    }
    );
  }

  render = () => (
    this.state.loaded
      ? <div>
        <div css={{
          textAlign: "center",
          marginBottom: 30,
        }}>
          <h2 className="mucapp">
            Events
          </h2>
          <div>
            {this.state.events.map((event, index) => <EventCard key={index} event={event} />)}
          </div>
        </div></div>
      : <div css={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>Fetching events...</div>
  );
};


const EventCard = ({ event }) => (
  <div className="p-5">
    <div css={{
      fontSize: "1.3em",
    }}>
      {event.name}
    </div>
    <div css={{
      fontSize: "0.9em",
      color: new Date() > new Date(event.endDate) ? "red" : "green",
    }}>
      Round {event.rounds.length}
      {
        new Date() > new Date(event.endDate)
          ? " ended " + (new Date(event.endDate)).toLocaleString()
          : new Date() >= new Date(event.startDate) && new Date() < new Date(event.endDate)
            ? " ends " + (new Date(event.endDate)).toLocaleString()
            : " starts " + (new Date(event.startDate)).toLocaleString() + " at " + event.venue
      }
    </div>
  </div>
);