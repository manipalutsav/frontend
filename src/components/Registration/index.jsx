import React from "react";
import { Link } from "gatsby";
import './style.css'

import eventsService from "../../services/events";
import collegesService from "../../services/colleges";
import { getUser } from "../../services/userServices";
import { Button } from "../../commons/Form";
import LoadContent from "../../commons/LoadContent";
import participationStatus from "../../services/participationStatus";
import { toast } from "../../actions/toastActions";
import Block from "../../commons/Block";
import { Tab, Tabs } from "../../commons/Tabs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const EventCard = ({ event }) => {
  return (
    <div

      css={{
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
        <div>
          <Block show={Date.now() < new Date(event.startDate).getTime()}>
            <Block show={Date.now() < new Date(event.registrationStartDate).getTime()}>
              <small>Registration starts at {new Date(event.registrationStartDate).toLocaleString()} and ends at {new Date(event.registrationEndDate).toLocaleString()}</small>
            </Block>
            <Block show={new Date(event.registrationStartDate).getTime() < Date.now() && Date.now() < new Date(event.registrationEndDate).getTime()}>
              <div><small>Registration ends at {new Date(event.registrationEndDate).toLocaleString()}</small></div>
              <Link to={"/register/" + event.id}><Button>Register</Button></Link>
            </Block>
            <Block show={new Date(event.registrationEndDate).getTime() < Date.now()}>
              <small>Registration has ended.</small>
            </Block>
          </Block>
          <Block show={new Date(event.startDate).getTime() < Date.now() && Date.now() < new Date(event.endDate).getTime()}>
            <div><span css={{ fontSize: "0.6em", background: "#18acd2", color: "white", padding: 5, marginBottom: 5, display: "inline-block", borderRadius: 10 }}>Event is ongoing!</span></div>
          </Block>
          <Block show={new Date(event.endDate).getTime() < Date.now()}>
            <div><span css={{ fontSize: "0.6em", background: "#8c3939", color: "white", padding: 5, marginBottom: 5, display: "inline-block", borderRadius: 10 }}> Event is done.</span></div>
          </Block>
        </div>
      </div>
    </div>
  )
};

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      teams: [],
      college: {
        isOutStationed: false
      },
      participationStatus: {},
      loading: true,
      disableSubmit: false,
      tabIndex: 0,
      searchQuery: "",
    };
  }

  async init() {

    try {
      let user = getUser();
      let college = await collegesService.get(user.college);
      let teams = await collegesService.getTeams(college.id);
      let events = await eventsService.getAll();
      let statues = await participationStatus.getByCollege(college.id);
      let participationStatusObj = {};
      let disableSubmit = statues.length > 0;
      statues.forEach(obj => {
        participationStatusObj[obj.event] = obj.status;
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
        unregistered: !teams.some(team => team.event._id === event.id),
        registeredCount: teams.filter(team => team.event._id === event.id).length,
        faculty: event.faculty,
        registrationStartDate: event.registrationStartDate,
        registrationEndDate: event.registrationEndDate
      }));
      events.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      });

      this.setState({ college, teams, events, participationStatus: participationStatusObj, loading: false, disableSubmit });
    }
    catch (e) {
      console.log(e)
    }
  }

  componentWillMount() {
    this.init();
  };


  handleChange = ({ eventId, state }) => {
    let participationStatus = this.state.participationStatus;
    participationStatus[eventId] = state;
    this.setState({ participationStatus })
    this.forceUpdate();
  }

  handleSave = async () => {
    try {
      let college = getUser().college;
      let statues = Object.keys(this.state.participationStatus).map(event => ({
        event,
        college,
        status: this.state.participationStatus[event] || "No"
      }))

      await participationStatus.create(statues);
    } catch (e) {
      toast(e.message);
    }

  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value })
  };

  render = () => (
    <div data-theme="lofi">

      <div className="justify-center flex flex-wrap flex-col">
        <LoadContent loading={this.state.loading} noDiv={true}>
          {/* <Block show={this.state.college.isOutStationed} id="1">
            <div>
              <h2 className="mucapp">Tentative participation information</h2>
              <Block show={!this.state.disableSubmit} id="2">
                <p>Please select your participation status</p>
              </Block>
              <Tabs onChange={(tabIndex) => this.setState({ tabIndex })}>
                <Tab>All</Tab>
                <Tab>Students only</Tab>
                <Tab>Staff Only</Tab>

              </Tabs>

            </div>
            <table className="table w-full table-zebra" >
              <thead><tr>
                <th>Event</th>
                <th>Date</th>
                <th>Participation Status</th>
              </tr></thead>
              <tbody>
                {this.state.events.filter(event => {
                  if (this.state.tabIndex === 0)
                    return true;
                  if (this.state.tabIndex === 1 && !event.faculty)
                    return true;
                  if (this.state.tabIndex === 2 && event.faculty)
                    return true;
                  return false;
                }).map(event => <tr>
                  <td>{event.name}</td>
                  <td className="text-xs">{(new Date(event.startDate)).toLocaleString()} to {(new Date(event.endDate)).toLocaleString()}</td>
                  <td>

                    <Switch eventId={event.id} state={this.state.participationStatus[event.id]} onChange={this.handleChange} disabled={this.state.disableSubmit} />

                  </td>
                </tr>)}
              </tbody>
            </table>
            <Block show={!this.state.disableSubmit} id="3">
              <div className="text-center p-5">
                <button className="mucapp" onClick={this.handleSave}>Submit</button>
              </div>
            </Block>
            <Block show={this.state.disableSubmit} id="4">
              Participation Status already submitted. Please contact administrators if any change is required.
            </Block>
          </Block> */}

          <div>
            <h2 className="mucapp">Registration</h2>
            <p>Register teams for the events in Utsav</p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by event name"
                value={this.state.searchQuery}
                onChange={this.handleSearch}
                title="Enter the event name to search"
              />
              <div className="clear-icon-container" onClick={() => { this.setState({ searchQuery: "" }) }} title="Clear">
                <FontAwesomeIcon icon={faClose} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap">

            {this.state.events
              .filter(event => event.name.toLowerCase().includes(this.state.searchQuery.toLowerCase()))
              .map((event, i) => <EventCard key={i} event={event} />)}
          </div>
        </LoadContent>
      </div>
    </div>
  );
};

const Switch = ({ eventId, state, onChange, disabled }) => {

  const onClick = (state) => {
    if (disabled)
      return;
    onChange({ eventId, state });
  }

  return <div className="btn-group" data-theme="bumblebee">
    <button disabled={disabled} onClick={() => onClick("Yes")} className={`btn ` + (state === "Yes" ? "btn-active" : "")}>Yes</button>
    <button disabled={disabled} onClick={() => onClick("Maybe")} className={`btn ` + (state === "Maybe" ? "btn-active" : "")}>Maybe</button>
    <button disabled={disabled} onClick={() => onClick("No")} className={`btn ` + (state === "No" || state === undefined ? "btn-active" : "")}>No</button>
  </div>
}

