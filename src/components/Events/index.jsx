import React from "react";
import { Link } from "gatsby";

import eventsService from "../../services/events";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faTableList } from '@fortawesome/free-solid-svg-icons'
import LoadContent from "../../commons/LoadContent";
import participationStatus from "../../services/participationStatus";





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
  <Link to={"/events/" + event.id} css={{
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
      mode: "card"
    };
  }


  async init() {

    try {
      let events = await eventsService.getAll();
      let statues = await participationStatus.get();
      let participationStatusObj = {};
      statues.forEach(obj => {
        if (!participationStatusObj[obj.event]) {
          participationStatusObj[obj.event] = {
            yes: 0,
            no: 0,
            maybe: 0
          }
        }
        if (obj.status === "Yes")
          participationStatusObj[obj.event].yes++;
        else if (obj.status == "Maybe")
          participationStatusObj[obj.event].maybe++;
        else
          participationStatusObj[obj.event].no++;
      });
      events = events.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        college: event.college,
        venue: event.venue,
        rounds: event.rounds,
        startDate: event.startDate,
        endDate: event.endDate,
        maxTeamsPerCollege: event.maxTeamsPerCollege,
        faculty: event.faculty,
        participationStatus: participationStatusObj[event.id]
      }));
      events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      });

      this.setState({ events, loading: false });
    }
    catch (e) {
      console.log(e)
    }
  }

  componentWillMount = async () => {

    this.init();
    // get();

    // this.unsubscribe = reducer.subscribe(() => {
    //   reducer.getState().then(state => {
    //     let events = state.data.list.map(event => ({
    //       id: event.id,
    //       name: event.name,
    //       description: event.description,
    //       college: event.college,
    //       venue: event.venue,
    //       rounds: event.rounds,
    //       startDate: event.startDate,
    //       endDate: event.endDate,
    //     }));

    //     events.sort((a, b) => {
    //       return new Date(a.startDate) - new Date(b.startDate);
    //     });

    //     this.setState({ events, loading: false });
    //   });
    // });

    // if (!response) return toast("Failed to load events, refresh to try again.");
    // if (response.status !== 200) return toast(response.message);
  };


  render = () => (
    <div>
      <div>
        <h2 className="mucapp ">Events</h2>
        <Link to="/events/add"><button className="mucapp">Add Event</button></Link>
      </div>
      <div className="text-center">
        <FontAwesomeIcon icon={faTable} style={{ padding: 4, color: "grey" }} />
        <input type="checkbox" className="toggle" data-theme="light" onClick={() => this.setState({ mode: this.state.mode == "table" ? "card" : "table" })} />
        <FontAwesomeIcon icon={faTableList} style={{ padding: 4, color: "grey" }} />
      </div>

      <LoadContent loading={this.state.loading} noDiv={true}>
        {this.state.mode == "table" ? <>
          <table className="table w-full table-zebra" >
            <thead><tr>
              <th>Event Name</th>
              <th>Venue</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Rounds</th>
              <th>Max Teams Per college</th>
              <th>Is Faculty Event</th>
              <th>OutStationed Campuses</th>
            </tr></thead>
            <tbody>
              {this.state.events.map(event => <tr>
                <td>{event.name}</td>
                <td>{event.venue}</td>
                <td>{event.startDate}</td>
                <td>{event.endDate}</td>
                <td>{event.rounds.length}</td>
                <td>{event.maxTeamsPerCollege}</td>
                <td>{event.faculty ? "true" : ""}</td>
                <td>{event.participationStatus ? (`${event.participationStatus.yes} Yes, ${event.participationStatus.maybe} Maybe,${event.participationStatus.no} No`) : ""}</td>
                <td>
                </td>
              </tr>)}
            </tbody>
          </table>


        </>
          :
          <div css={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
          }}>
            {this.state.events.map((event, i) => <EventCard key={i} event={event} />)}
          </div>}
      </LoadContent>
    </div>

  );
};
