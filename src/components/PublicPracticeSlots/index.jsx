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
        : <div css={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>Slots are yet to be generated</div>
      : <div css={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>Please wait while we check for slots...</div>
  );
};
