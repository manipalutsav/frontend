import React from "react";
import Scramble from "react-scramble";

import practiceSlotsService from "../../services/practiceSlots";
import LBList from "../../commons/LBList";
import Shuffle from "../../commons/Shuffle";
import { getTeamName } from "../../utils/common";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.slots = [];
    this.timer = null;

    this.state = {
      loaded: false,
      event: {},
      slots: [],
      teams: [],
      visibleSlots: [],
      showOnlyRegistered: true,
      newSlots: [],
      slotting: false,
      slotted: false,
      eventDate: "2024-04-01"
    }
  }

  componentWillMount() {
    //console.log("check");
    practiceSlotsService.getPracticeSlot(this.state.eventDate).then(slots =>
      this.setState({ slots, loaded: true, slotted: slots?.length > 0 })
    );
  }

  getTimeSlot = (index) => {
    console.log(this.state.slots,"slots")
    var totalTeams = this.state.slots?.length;
    // time should start from 6 till 10 am
    const startTime = new Date();
    startTime.setHours(6, 0, 0, 0); 
    const endTime = new Date();
    endTime.setHours(10, 0, 0, 0);
    //total  = 10am-6am = 240 minutes

    // total minutes between 6 am to 10 am
    //can hardcode 240 mins
    const totalMinutes = (endTime - startTime) / (1000 * 60);

    // time in minutes per team  
    let timePerTeam = Math.floor(totalMinutes / totalTeams);

    // if it exceeds 15 min then restrict it to 15 only ie (if there are less teams)
    timePerTeam = Math.min(timePerTeam, 15);

    // calculate slot timing for perticular team
    const slotStartTime = new Date(startTime.getTime() + index * timePerTeam * 60 * 1000);
    const slotEndTime = new Date(slotStartTime.getTime() + timePerTeam * 60 * 1000);

    // formating of time
    const startTimeString = slotStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTimeString = slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${startTimeString} - ${endTimeString}`;
}

handleDateChange = (event) => {
  // Function to handle date selection from dropdown
  this.setState({ eventDate: event.target.value });
  practiceSlotsService.getPracticeSlot(event.target.value).then(slots =>
    this.setState({ slots, loaded: true, slotted: slots?.length > 0 })
  );
}

  render = () => (
    
    this.state.loaded
      ? this.state.slotted
        ? <div>
          
          <div css={{
            textAlign: "center",
            marginBottom: 30,
          }}>
            
            <h2 className="mucapp">
              Practice Slots
            </h2>
            <select name="date" id="date" style={{"cursor":"pointer"}} className=" py-2 px-4 border border-orange-500 rounded-md bg-slate-300 bg-opacity-100" value={this.state.eventDate} onChange={this.handleDateChange}>
      {/* Dropdown to select event date */}
      <option value="2024-04-01">April 1, 2024</option>
      <option value="2024-04-02">April 2, 2024</option>
      <option value="2024-04-03">April 3, 2024</option>
      <option value="2024-04-04">April 4, 2024</option>
      <option value="2024-04-05">April 5, 2024</option>
    </select>
          </div>
          <div>
            {
              this.state.slots.map((slot, i) =>
                <LBList
                  key={i}
                  color={"#222"}
                  position={slot.order}
                  team={String.fromCharCode(65 + slot.team)}
                  title={`${slot.college}, ${slot.location}`}
                  description={this.getTimeSlot(i)}
                />
              )
            }
          </div>
        </div>
        : <div css={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>Slots are yet to be generated for 
        <select name="date" id="date" style={{"cursor":"pointer"}} value={this.state.eventDate} onChange={this.handleDateChange} className=" py-2 px-4 border border-orange-500 rounded-md bg-slate-300 bg-opacity-100">
      {/* Dropdown to select event date */}
      <option value="2024-04-01">April 1, 2024</option>
      <option value="2024-04-02">April 2, 2024</option>
      <option value="2024-04-03">April 3, 2024</option>
      <option value="2024-04-04">April 4, 2024</option>
      <option value="2024-04-05">April 5, 2024</option>
    </select>
        </div>
      : <div css={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>Please wait while we check for slots...</div>
  );
};
