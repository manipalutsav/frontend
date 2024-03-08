import React from "react";
import { Link, navigate } from "gatsby";
import eventsService from "../../services/events";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faTableList, faClose } from '@fortawesome/free-solid-svg-icons'
import LoadContent from "../../commons/LoadContent";
import participationStatus from "../../services/participationStatus";
import './style.css'




const styles = {
  eventCard: {
    // marginRight: 20,
    // marginBottom: 20,
    padding: 20,
    minHeight: 200,
    height: "auto",
    width: "100%",
    borderRadius: 5,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
    transition: "all .2s ease",
    ":hover": {
      color: "inherit",
      boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
      transform: "translateY(-10px)"
    },
  },
  table_styles: {
    // border: "2px solid black",
    fontSize: "16px",
    textWrap: "balance",
  },
  table_th: {
    overflowX: "hidden"
  }
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
    <div
      className={`text-[0.9em] ${new Date() > new Date(event.endDate) ? "text-red-500" : "text-green-500"
        }`}>
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
      mode: "card",
      searchQuery: "",
    };
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  async init() {

    try {
      let events = await eventsService.getAll();
      // Calculating no. of outstation colleges registered
      events = await Promise.all(events.map(async (e)=>{
        const team = await eventsService.getTeams(e.id);
        const alreadyCheckedClgs = [];

        const noOfOutstation= team.filter(t=>{
          const res = t.college.isOutStationed === true && alreadyCheckedClgs.findIndex((id)=>id === t.college._id) === -1;
          alreadyCheckedClgs.push(t.college._id)
          return res;
        }).length;
        return {...e, noOfOutstation}
      }))
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
        else if (obj.status === "Maybe")
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
        participationStatus: participationStatusObj[event.id],
        noOfOutstation: event.noOfOutstation
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
    <div className="event-list-outer-container">
      <div>
        <h2 className="mucapp ">Events</h2>
        <Link to="/events/add"><button className="mucapp">Add Event</button></Link>
      </div>
      <div className="text-center flex justify-start items-center py-5">
        <FontAwesomeIcon icon={faTable} style={{ padding: 4, color: "grey" }} />
        <input type="checkbox" className="toggle" data-theme="light" onClick={() => this.setState({ mode: this.state.mode === "table" ? "card" : "table" })} />
        <FontAwesomeIcon icon={faTableList} style={{ padding: 4, color: "grey" }} />
      </div>

      <LoadContent loading={this.state.loading} noDiv={true}>
        <div className="flex justify-start items-start">

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
        {this.state.mode === "table" ? <>
          <table className="events-table table table-zebra w-full overflow-x-auto border" >
            <thead><tr>
              <th style={styles.table_th}>Event Name</th>
              <th style={styles.table_th}>Venue</th>
              <th style={styles.table_th}>Start Date</th>
              <th style={styles.table_th}>End Date</th>
              <th style={styles.table_th}>Rounds</th>
              <th style={styles.table_th}>Max Teams Per college</th>
              <th style={styles.table_th}>Is Faculty Event</th>
              <th style={styles.table_th}>Outstation count</th>
            </tr></thead>
            <tbody>
              {
                this.state.events
                  .filter((event) =>
                    event.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())
                  )
                  .map((event, index) => {
                    return (
                      <tr className="table-data-row" onClick={() => { navigate("/events/" + event.id) }}  key={index}>
                        <td style={styles.table_styles}>{event.name}</td>
                        <td style={styles.table_styles}>{event.venue}</td>
                        <td style={{ ...styles.table_styles, minWidth: "100px" }}>{event.startDate?.slice(0, 10)}</td>
                        <td style={{ ...styles.table_styles, minWidth: "100px" }}>{event.endDate?.slice(0, 10)}</td>
                        <td style={styles.table_styles}>{event.rounds.length}</td>
                        <td style={styles.table_styles}>{event.maxTeamsPerCollege}</td>
                        <td style={styles.table_styles}>{event.faculty ? "true" : ""}</td>
                        {/* This uses the yes/maybe/no system developed for 2023. */}
                        {/* <td style={styles.table_styles}>{event.participationStatus ? (`${event.participationStatus.yes} Yes, ${event.participationStatus.maybe} Maybe,${event.participationStatus.no} No`) : ""}</td> */}

                        {/* Manually calculated by registration */}
                        <td style={styles.table_styles}>{JSON.stringify(event.noOfOutstation)}</td>

                      </tr>
                    );
                  })
              }
            </tbody>
          </table>


        </>
          :
          <div
            // css={{
            //   marginTop: 20,
            //   display: "flex",
            //   flexWrap: "wrap",
            // }}
            className="h-auto w-full grid xl:grid-cols-5 md:grid-cols-2 gap-5"
          >
            {this.state.events
              .filter((event) =>
                event.name.toLowerCase().trim().includes(this.state.searchQuery.toLowerCase().trim())
              )
              .map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
          </div>}
      </LoadContent>
    </div>

  );
};
