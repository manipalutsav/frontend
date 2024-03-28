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

    this.animate = this.animate.bind(this);
    this.startSlotting = this.startSlotting.bind(this);
    this.deleteSlots = this.deleteSlots.bind(this);

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
    }
  }

  componentWillMount() {
    practiceSlotsService.getPracticeSlot().then(slots =>
      this.setState({ slots, loaded: true, slotted: slots.length > 0 })
    );
  }

  getTimeSlot = (index) => {
    var totalTeams = this.state.slots.length;
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


  animate(slots) {
    this.slots = Object.assign([], slots);
    //this.slots = slots;

    this.timer = setInterval(() => {
      let slot = this.slots.shift();

      if (!slot) {
        return clearTimeout(this.timer);
      }

      let newSlots = this.state.newSlots;
      newSlots.push(slot);

      this.setState({ newSlots, });
    }, 1000);
  }

  startSlotting() {
    this.setState({ slotting: true, });

    practiceSlotsService.createPracticeSlot().then(slots =>
      this.setState({ slots }, () =>
        this.animate(this.state.slots)
      )
    )

  }

  deleteSlots() {

    if (typeof window !== "undefined" && window.confirm("Are you sure you want to reset slots?")) {
      practiceSlotsService.deletePracticeSlot().then(() => {
        this.slots = [];
        this.timer = null;

        this.setState({
          slots: [],
          newSlots: [],
          slotting: false,
          slotted: false,
        })
      });
    }
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
            <button className="mucapp" onClick={this.deleteSlots}>Reset Slots</button>
          </div>
          <div>
            {
              this.state.slots.map((slot, i) =>
                <LBList
                  key={i}
                  color={slot.registered ? "#444" : "#999"}
                  position={slot.number}
                  title={`${slot.name}, ${slot.location}`}
                  description={this.getTimeSlot(i)}
                />
              )
            }
          </div>
        </div>
        : this.state.slotting
          ? <div>
            <div css={{
              textAlign: "center",
              marginBottom: 30,
            }}>
              <h2 className="mucapp">
                Practice slots
                {this.state.event.rounds && this.state.event.rounds.length > 1 && (
                  <>
                    {" "}
                    Round {this.state.event.rounds.indexOf(this.props.round) + 1}
                  </>
                )}
              </h2>
              <button className="mucapp" onClick={this.deleteSlots}>Reset Slots</button>

            </div>

            <div>
              {
                this.state.newSlots.map((slot, i) =>
                  <LBList

                    key={i}
                    position={slot.number}
                    title={
                      <Scramble
                        autoStart
                        preScramble
                        speed="slow"
                        text={`${slot.name}, ${slot.location}`}
                        steps={[
                          {
                            action: "-",
                            type: "random",
                          },
                        ]}
                      />
                    }
                    description={this.getTimeSlot(i)}
                  />
                )
              }
            </div>
            <div>
              {
                this.state.slots.length !== this.slots.length && this.slots.length
                  ? <Shuffle />
                  : null
              }
            </div>
          </div>
          : <div css={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <h2 className="mucapp">{this.state.event.name}</h2>
            <div css={{ color: "rgba(0, 0, 0, .5)" }}>
              Practice slots are not yet generated
            </div>
            <p css={{ color: "green" }}>Generate slots now!</p>
            <button className="mucapp" onClick={this.startSlotting}>
              {
                this.state.slotting
                  ? "Slotting..."
                  : "Start Slotting"
              }
            </button>
          </div>
      : <div>Please wait while we check for slots...</div>
  );
};
