import React from "react";
import Scramble from "react-scramble";

import eventsService from "../../services/events";
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
    eventsService.get(this.props.event).then(event =>
      this.setState({ event })
    );

    eventsService.getSlots2(this.props.event, this.props.round).then(slots => {
      eventsService.getTeams(this.props.event).then(teams => {

        slots.forEach(slot => {
          let team = teams.find(team => team.index === slot.teamIndex && team.college._id === slot.college._id);

          if (team) {
            slot.registered = true;
          }
        })

        this.setState({ slotted: !!slots.length, slots, visibleSlots: slots, teams, loaded: true }, () => {
          this.filterVisibleSlots();
        })
      });
    });

  }

  filterVisibleSlots = () => {
    if (this.state.showOnlyRegistered) {
      //comment
      this.setState({ visibleSlots: this.state.slots.filter(slot => slot.registered) });
    }
    else {
      this.setState({ visibleSlots: this.state.slots })
    }
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

    eventsService.createSlots2(this.props.event, this.props.round).then(slots =>
      this.setState({ slots }, () =>
        this.animate(this.state.slots)
      )
    )

  }

  deleteSlots() {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to reset slots?")) {
      eventsService.deleteSlots2(this.props.event, this.props.round).then(() => {
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
              {this.state.event.name} Round {this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1)} Slots
            </h2>
            <button className="mucapp" onClick={this.deleteSlots}>Reset Slots</button>
          </div>
          <div css={{ textAlign: "center" }}>
            <input type="checkbox" id="slotsFilter" defaultChecked={this.state.showOnlyRegistered} onChange={(e) => { this.setState({ showOnlyRegistered: e.target.checked }, this.filterVisibleSlots); }} /> <label htmlFor="slotsFilter">Show only registered teams</label>
          </div>
          <div>
            {
              this.state.visibleSlots.map((slot, i) =>
                <LBList
                  key={i}
                  color={slot.registered ? "#444" : "#999"}
                  position={slot.number}
                  title={getTeamName(slot)}
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
                Slotting teams for {this.state.event.name} Round {this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1)}
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
                        text={getTeamName(slot)}
                        steps={[
                          {
                            action: "-",
                            type: "random",
                          },
                        ]}
                      />
                    }
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
              Teams haven't been slotted for Round {this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1)}
            </div>
            <p css={{ color: "green" }}>Generate slots now!</p>
            <button className="mucapp" onClick={this.startSlotting}>
              {
                this.state.slotting
                  ? "Slotting..."
                  : "Slot Teams"
              }
            </button>
          </div>
      : <div>Please wait while we check for slots...</div>
  );
};
