import React from "react";
import { Link } from "gatsby";

import { get } from "../../services/eventService";
import reducer from "../../reducers/commonReducer";
import Loader from "../../commons/Loader";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = {
  eventCard: {
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    width: 285,
    borderRadius: 3,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
    transition: "box-shadow .2s ease",
    ":hover": {
      color: "inherit",
      boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
    },
  },
};

const EventCard = ({ event }) => (
  <Link to={"/slots/" + event.id} css={{
    ...styles.eventCard,
  }}>
    <div css={{
      fontSize: "1.3em",
    }}>
      {event.name}
    </div>
    <div css={{
      fontSize: "0.9em",
      color: new Date() > new Date(event.endDate) ? "red" : "green",
    }}>
      {
        new Date() > new Date(event.endDate)
          ? "ended " + (new Date(event.endDate)).toLocaleString()
          : new Date() >= new Date(event.startDate) && new Date() < new Date(event.endDate)
            ? "ends " + (new Date(event.endDate)).toLocaleString()
            : "starts " + (new Date(event.startDate)).toLocaleString() + " at " + event.venue
      }
    </div>
    <div css={{
      fontSize: "0.8em",
      color: "rgba(0, 0, 0, .5)",
    }}>
      {event.rounds.length} Round{event.rounds.length === 1 ? "" : "s"}
    </div>
  </Link>
);

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loading: true,
      searchQuery: "",
    };
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  componentWillMount = async () => {
    get();

    this.unsubscribe = reducer.subscribe(() => {
      reducer.getState().then(state => {
        let events = state.data.list.map(event => ({
          id: event.id,
          name: event.name,
          description: event.description,
          college: event.college,
          venue: event.venue,
          rounds: event.rounds,
          startDate: event.startDate,
          endDate: event.endDate,
        }));

        events.sort((a, b) => {
          return new Date(a.startDate) - new Date(b.startDate);
        });

        this.setState({ events, loading: false });
      });
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">Event Slots</h2>
        <p>Go to the event for which you want to see the slotting</p>
        <div className=" border border-1 border-slate-400 flex justify-center items-center rounded-full px-2 mb-5 w-full md:w-1/2 lg:w-1/3 xl:w-72">
            <input
              type="text"
              placeholder="Search by event name"
              value={this.state.searchQuery}
              onChange={this.handleSearch}
              title="Enter the event name to search"
              className="h-full px-2 py-3 w-full rounded-full outline-none text-md"
            />
            <div className="clear-icon-container" onClick={() => { this.setState({ searchQuery: "" }) }} title="Clear">
              <FontAwesomeIcon icon={faClose} />
            </div>
          </div>
      </div>
      <div css={{
        marginTop: 20,
        display: "flex",
        flexWrap: "wrap",
      }}>
        
        {
          this.state.loading
            ? <Loader />
            : this.state.events
                .filter((event) =>
                       event.name.toLowerCase().trim().includes(this.state.searchQuery.toLowerCase().trim())
                ).map((event, i) => <EventCard key={i} event={event} />)
        }
      </div>
    </div>
  );
};
