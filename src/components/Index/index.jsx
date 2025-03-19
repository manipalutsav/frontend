import { React, useState, useEffect } from 'react';
import utsavLogo from '../../images/loader.gif';
import Countdown from 'react-countdown';
import { Link, navigate } from 'gatsby';
import eventsService from '../../services/events';
import participationStatus from '../../services/participationStatus';
import { MdLocationOn, MdOpenInNew } from 'react-icons/md';
import { getSetting } from '../../services/settingsServices';
import mucapp_sardar from '../../images/UTSAV_NEW_LOGO.png';

const cookingEventsOpenDate = new Date('February 27, 2025, 23:59:59');
const cookingEventsCloseDate = new Date('March 6, 2025, 17:00:00');
const studentEventsOpenDate = new Date('March 15, 2025, 21:00:00');
const studentEventsCloseDate = new Date('March 27, 2025, 23:59:59');

// JSON for the google map location for each venue. Since location is not being saved, this json should be updated everytime a new venue is added or removed
// venue: *name of the venue on the website
// location: *name of the venue on google map
const venueLocations = [
  {
    venue: 'Dr. TMA Pai Hall, 1st Floor',
    location: 'Dr. TMA Pai Halls',
  },
  {
    venue: 'Dr. TMA Pai Hall, 2nd Floor',
    location: 'Dr. TMA Pai Halls',
  },
  {
    venue: 'Dr. TMA Pai Hall, 3rd Floor',
    location: 'Dr. TMA Pai Halls',
  },
  {
    venue: 'Counselling Hall, manipal.edu',
    location: '',
  },
  {
    venue: 'MMMC, Manipal',
    location: 'Melaka Manipal Medical College (MMMC)',
  },
  {
    venue: 'KMC Greens, Main Stage',
    location: 'KMC Greens',
  },
  {
    venue: 'KMC Greens, STEPS',
    location: 'KMC Greens',
  },
  {
    venue: 'KMC Food Court, 2nd floor',
    location: 'KMC Food Court',
  },
  {
    venue: 'WGSHA, Kitchen',
    location: 'Welcomgroup Graduate School of Hotel Administration (WGSHA)',
  },
  {
    venue: 'Sharada Hall, MCHP',
    location: 'Sharada Hall, MCHP, MAHE, Manipal',
  },
  {
    venue: 'DBMS/MMMC (3rd Floor - Digi Lab)',
    location: 'Melaka Manipal Medical College (MMMC)',
  },
  {
    venue: 'Biochemistry LH 1',
    location: 'Department of Biochemistry',
  },
];

const styles = {
  eventCard: {
    // marginRight: 20,
    // marginBottom: 20,
    padding: 20,
    minHeight: 200,
    height: 'auto',
    width: '100%',
    borderRadius: 5,
    border: '2px solid rgba(0, 0, 0, .1)',
    color: 'inherit',
    boxShadow: '0px 5px 20px -4px rgba(0, 0, 0, .1)',
    transition: 'all .2s ease',
    ':hover': {
      color: 'inherit',
      boxShadow: '0px 5px 50px -4px rgba(0, 0, 0, .1)',
      transform: 'translateY(-10px)',
    },
  },
  table_styles: {
    // border: "2px solid black",
    fontSize: '16px',
    textWrap: 'balance',
  },
  table_th: {
    overflowX: 'hidden',
  },
};

const reg_renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>registrations are closed!</span>;
  } else {
    if (days === 0 && hours === 0 && minutes === 0) {
      return <span>registrations close in: {seconds} seconds</span>;
    } else if (days === 0 && hours === 0) {
      return (
        <span>
          registrations close in: {minutes} minutes and {seconds} seconds
        </span>
      );
    } else if (days === 0) {
      return (
        <span>
          registrations close in: {hours} hours, {minutes} minutes and {seconds}{' '}
          seconds
        </span>
      );
    } else {
      return (
        <span>
          registrations close in: {days} days, {hours} hours, {minutes} minutes
          and {seconds} seconds
        </span>
      );
    }
  }
};

const event_renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <div className="m-4 flex justify-center">
        <div
          className="mb-16 p-4 rounded-md bg-orange-200 text-2xl gap-2 align-middle justify-center flex outline outline-orange-500 outline-2 font-bold"
          css={{ width: 300 }}
        >
          Welcome to Utsav 2025!{' '}
          <span className="font-['Noto_Color_Emoji']"></span>
        </div>
      </div>
    );
  } else {
    if (days === 0 && hours === 0 && minutes === 0) {
      return <span>Staff events start in: {seconds} seconds</span>;
    } else if (days === 0 && hours === 0) {
      return (
        <span>
          Staff events start in: {minutes} minutes and {seconds} seconds
        </span>
      );
    } else if (days === 0) {
      return (
        <span>
          Staff events start in: {hours} hours, {minutes} minutes and {seconds}{' '}
          seconds
        </span>
      );
    } else {
      return (
        <span>
          Staff events start in: {days} days, {hours} hours, {minutes} minutes
          and {seconds} seconds
        </span>
      );
    }
  }
};

const RegistrationTimer = () => {
  const current_date = new Date();
  if (current_date >= studentEventsOpenDate) {
    return (
      <>
        <span>Student event </span>
        <Countdown date={studentEventsCloseDate} renderer={reg_renderer} />
      </>
    );
  } else if (current_date >= cookingEventsOpenDate) {
    return (
      <>
        <span>Cooking event </span>
        <Countdown date={cookingEventsCloseDate} renderer={reg_renderer} />
      </>
    );
  }
  return <></>;
};

export default () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let events = await eventsService.getAll();
        events = await Promise.all(
          events.map(async (e) => {
            const team = await eventsService.getTeams(e.id);
            const alreadyCheckedClgs = [];

            const noOfOutstation = team.filter((t) => {
              const res =
                t.college.isOutStationed === true &&
                alreadyCheckedClgs.findIndex((id) => id === t.college._id) ===
                  -1;
              alreadyCheckedClgs.push(t.college._id);
              return res;
            }).length;
            return { ...e, noOfOutstation };
          })
        );
        let statues = await participationStatus.get();
        let participationStatusObj = {};
        statues.forEach((obj) => {
          if (!participationStatusObj[obj.event]) {
            participationStatusObj[obj.event] = {
              yes: 0,
              no: 0,
              maybe: 0,
            };
          }
          if (obj.status === 'Yes') participationStatusObj[obj.event].yes++;
          else if (obj.status === 'Maybe')
            participationStatusObj[obj.event].maybe++;
          else participationStatusObj[obj.event].no++;
        });
        events = events.map((event) => ({
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
          noOfOutstation: event.noOfOutstation,
        }));
        events.sort((a, b) => {
          return new Date(a.startDate) - new Date(b.startDate);
        });
        setEvents(events);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    console.log(events, 'events data');

  // }, [events]);
  
}, []); // Commented to avoid infinite loop


  return (
    <div
      css={{
        textAlign: 'center',
      }}
      className="mt-5"
    >
      <h2 className="mucapp">MAHE Utsav Coordinators App</h2>
      <h1 className="mucapp"> UTSAV 2025!</h1>
      <div className="hero-image-container h-72 flex justify-center items-center my-5">
        <img src={mucapp_sardar} alt="" className="h-full" />
      </div>
      <Countdown
        date={new Date('March 24, 2025, 10:30:00')}
        renderer={event_renderer}
      />

      {/* <RegistrationTimer /> */}
      {/* <div className="festival-live-message">The festival is on!</div> */}
      {/* <img className="mucapp" css={{ width: "60%" }} alt="Logo" src={utsavLogo} /> */}

      {/* <div className="broadcast-container mt-5 mb-5 overflow-x-auto">
        <h4 className="text-left">Upcoming Events ( Today )</h4>
        {events.filter(event => {
          const eventStartDate = new Date(event.startDate);
          const today = new Date();
          return (
            eventStartDate.getDate() === today.getDate() &&
            eventStartDate.getMonth() === today.getMonth() &&
            eventStartDate.getFullYear() === today.getFullYear()
          );
        }).length > 0 ? (
          <table className="events-table table table-zebra w-full overflow-x-auto">
            <thead>
              <tr>
                <th style={styles.table_th}>Event Name</th>
                <th style={styles.table_th}>Venue <span className="capitalize">( Click to View in Google Maps )</span></th>
                <th style={styles.table_th}>Start Time</th>
                <th style={styles.table_th}>End Time</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter(event => {
                  const eventStartDate = new Date(event.startDate);
                  const today = new Date();
                  return (
                    eventStartDate.getDate() === today.getDate() &&
                    eventStartDate.getMonth() === today.getMonth() &&
                    eventStartDate.getFullYear() === today.getFullYear()
                  );
                })
                .map((event, index) => {
                  const startTime = new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endTime = new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const venue = event.venue;
                  const locationInfo = venueLocations.find(item => item.venue === venue);
                  const googleMapsLink = locationInfo ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationInfo.location)}` : null;

                  return (
                    <tr key={index}>
                      <td style={styles.table_styles} className="capitalize">{event.name}</td>
                      <td style={styles.table_styles} className="flex flex-row items-center justify-start">
                        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="underline">{event.venue}</a>
                        <div className="flex items-center justify-center ml-2">
                          <MdLocationOn />
                        </div>
                      </td>
                      <td style={{ ...styles.table_styles, minWidth: "100px" }}>{startTime}</td>
                      <td style={{ ...styles.table_styles, minWidth: "100px" }}>{endTime}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <p>No More Events Today</p>
        )}
      </div> */}

      {/* <div className="broadcast-container mt-5 overflow-x-auto">
        <h4 className="text-left">Completed Events</h4>
        <table className="events-table table table-zebra w-full overflow-x-auto border" >
          <thead><tr>
            <th style={styles.table_th}>Event Name</th>
            <th style={styles.table_th}>Total Participants</th>
            <th style={styles.table_th}>1st Place</th>
            <th style={styles.table_th}>2nd Place</th>
            <th style={styles.table_th}>3rd Place</th>
          </tr></thead>
          <tbody>
            {
              events
                .filter(event => {
                  const eventEndDate = new Date(event.endDate);
                  const today = new Date();
                  return eventEndDate < today; // Filter events with end date before today
                })
                .map((event, index) => {
                  const startTime = new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const endTime = new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={index}>
                      <td style={styles.table_styles}>{event.name}</td>
                      <td style={styles.table_styles}>{event.venue}</td>
                      <td style={{ ...styles.table_styles, minWidth: "100px" }}>{startTime}</td>
                      <td style={{ ...styles.table_styles, minWidth: "100px" }}>{endTime}</td>
                      <td style={{ ...styles.table_styles, minWidth: "100px" }}>{endTime}</td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div> */}
    </div>
  );
};
