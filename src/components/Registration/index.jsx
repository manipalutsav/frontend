import React from "react";
import { Link } from "gatsby";

import constants from "../../utils/constants";
import eventsService from "../../services/events";
import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";
import { Button } from "../../commons/Form";
import LoadContent from "../../commons/LoadContent";

const EventCard = ({ event }) => {
  let registrationStatus = event.faculty ? constants.registrations.facultyEvents : constants.registrations.studentEvents;

  return (
    <Link to={"/register/" + event.id} css={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginRight: 20,
      marginBottom: 20,
      padding: 20,
      width: 350,
      borderRadius: 3,
      border: "2px solid rgba(0, 0, 0, .1)",
      color: "inherit",
      boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
      transition: "box-shadow .2s ease",
      ":hover": {
        color: "inherit",
        boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
      }
    }}>
      <div>
        <div css={{
          fontSize: "1.3em",
          marginBottom: "8px"
        }}>
          {event.name}
        </div>
        {event.faculty ? <div><span css={{ fontSize: "0.6em", background: "#ff5800", color: "white", padding: 5, marginBottom: 5, display: "inline-block", borderRadius: 10 }}>For Faculty</span></div> : ""}
        <div css={{
          fontSize: "0.8em",
          color: "rgba(0, 0, 0, .7)",
        }}>
          Organized by {event.college.name}
        </div>
        <div css={{
          fontSize: "0.7em",
          color: "rgba(0, 0, 0, .7)",
          marginBottom: 10,
        }}>
          {new Date(event.startDate).toLocaleString()}
        </div>
        <div css={{
          color: "rgba(0, 0, 0, .5)",
          fontSize: "0.9em",
          marginBottom: "8px",
          maxHeight: 200,
          overflowY: "auto",
          whiteSpace: "pre-wrap"
        }}>
          {event.description && event.description.replace(/[>]/g, '- ')}
        </div>
      </div>
      <div css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
      }}>
        <div css={{
          color: "red",
          fontSize: "0.8em",
        }}>
          <span>{event.unregistered ? "Unregistered" : ""}</span>
        </div>
        <div>
          {
            registrationStatus === false
              ? <span css={{ fontSize: "0.9em" }}>Registrations closed</span>
              : event.registeredCount !== event.maxTeamsPerCollege
                ? <Button>Register</Button>
                : <span css={{ fontSize: "0.9em" }}>Slots full for college</span>
          }
        </div>
      </div>
    </Link>
  )
};

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      teams: [],
      loading: true,
    };
  }

  componentWillMount = async () => {
    let user = getUser();
    collegesService.getTeams(user.college).then(teams => {
      teams = teams.map(team => team);

      this.setState({ teams });

      eventsService.getAll().then(events => {
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
          unregistered: !teams.some(team => team.event._id === event.id),
          registeredCount: teams.filter(team => team.event._id === event.id).length,
          faculty: event.faculty,
        }));
        events.sort((a, b) => {
          return new Date(a.startDate) - new Date(b.startDate);
        });

        this.setState({ events, loading: false });
      });
    });

  };

  render = () => (
    <div>
      <div>
        <h2>Registration</h2>
        <p>Register teams for the events in Utsav</p>
      </div>
      <div css={{
        display: "flex",
        flexWrap: "wrap",
      }}>
        <LoadContent loading={this.state.loading} noDiv={true}>
          {this.state.events.map((event, i) => <EventCard key={i} event={event} />)}
        </LoadContent>
      </div>
    </div>
  );
};
