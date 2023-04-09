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
    let hours = ["06", "07", "08", "09", "10", "11", "12", "01", "02", "03", "04", "05"]
    let mins = ["00", "15", "30", "45"]
    let endMin = ["59", "14", "29", "44"]
    let meridiem = ["AM", "PM"];
    let startHourIndex = Math.floor(index / 4) % 12;
    let startMinIndex = index % 4;
    let startMeridiemIndex = (Math.floor((startHourIndex + 6) / 12)) % 2;
    let nextIndex = index + 1;
    let endHourIndex = Math.floor(index / 4) % 12;
    let endMinIndex = nextIndex % 4;
    let endMeridiemIndex = (Math.floor((endHourIndex + 6) / 12)) % 2;
    return `${hours[startHourIndex]}:${mins[startMinIndex]} ${meridiem[startMeridiemIndex]} - ${hours[endHourIndex]}:${endMin[endMinIndex]} ${meridiem[endMeridiemIndex]}`
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
