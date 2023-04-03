import React from "react";
import Select from "react-select";

import eventsService from "../../services/events";
import LBList from "../../commons/LBList";
import { getTeamName } from "../../utils/common";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.slots = [];
    // this.loadData = this.loadData.bind(this);
    this.state = {
      loaded: false,
      event: {},
      round: null,
      roundOptions: [],
      slots: [],
      slotted: false,
    }
  }

  componentWillMount() {
    this.init();
  }
  init = async () => {
    let event = await eventsService.get(this.props.event);
    await this.setState({
      event,
      round: event.rounds[0],
      roundOptions: event.rounds.map((round, i) => ({
        label: "Round " + (i + 1),
        value: round,
      }))
    });

    this.fetchRoundSlots();
  }

  fetchRoundSlots = async () => {
    let slots = await eventsService.getSlots2(this.props.event, this.state.round);
    let teams = await eventsService.getTeams(this.props.event)

    slots.forEach(slot => {
      let team = teams.find(team => team.index === slot.teamIndex && team.college._id === slot.college._id);

      if (team) {
        slot.registered = true;
      }
    })

    // Look for newly registered teams and add them to the list of slots
    teams.forEach(team => {
      let existingSlot = slots.find(slot => slot.teamIndex === team.index && slot.college._id === team.college._id);
      if (!existingSlot) {
        // Create a new slot and add it to the list of slots
        let newSlot = {
          teamIndex: team.index,
          college: team.college,
          number: slots.length + 1,
          registered: true
        };
        slots.push(newSlot);
      }
    });

    this.setState({ slotted: !!slots.length, slots: slots, loaded: true });
  }

  handleRoundChange = (e) => {
    this.setState({ round: e.value, loaded: false, }, this.fetchRoundSlots);
  }

  showPDF = () => {
    if (typeof document !== "undefined") {
      let slots = document.getElementById("slots").innerHTML;
      let printWindow = window.open("", "", "height=500,width=800");

      printWindow.document.write("<html><head>");
      printWindow.document.write("<title>" + this.state.event.name + " Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)) + " - Slots</title>");
      printWindow.document.write("<style>body{font-family:sans-serif;}body>div{display:flex;justify-content:space-between;padding:5px;border-bottom:1px dashed #bbb;}h1{text-align:center;}</style>");
      printWindow.document.write("</head><body>");
      printWindow.document.write("<h1> " + this.state.event.name + " Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)) + " - Slots</h1>");
      printWindow.document.write(slots);
      printWindow.document.write("</body></html>");
      printWindow.document.close();

      printWindow.print();
    }
  }

  render = () => (
    <div>
      <div css={{
        textAlign: "center",
        marginBottom: 30,
      }}>
        <h2 className="mucapp">
          {this.state.event.name} Slots
        </h2>
        <div>
          <Select
            isSearchable={false}
            name="round"
            placeholder="Select Round"
            value={{ label: "Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)), value: this.state.round }}
            options={this.state.roundOptions}
            onChange={this.handleRoundChange}
            styles={{
              control: (provided, state) => ({
                ...provided,
                marginBottom: 10,
                border: state.isFocused ? "1px solid #ffd100" : "1px solid rgba(0, 0, 0, .1)",
                boxShadow: state.isFocused ? "0 3px 10px -5px rgba(0, 0, 0, .3)" : "",
                ":hover": {
                  border: "1px solid #ff5800",
                  boxShadow: "0 3px 10px -5px rgba(0, 0, 0, .3)",
                },
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? "#ff5800" : "",
                ":hover": {
                  backgroundColor: "#ffd100",
                  color: "black",
                },
              }),
            }}
            css={{
              fontSize: "16px",
              width: 200,
              display: "inline-block",
            }}
          />
        </div>
      </div>

      <div>
        {
          this.state.loaded
            ? this.state.slotted
              ? <div>
                <div css={{
                  textAlign: "center",
                  marginBottom: 30,
                }}>
                  <button className="mucapp" onClick={this.showPDF}>Generate PDF</button>
                </div>
                <div id="slots">
                  {
                    this.state.slots.map((slot, i) =>
                      <LBList
                        key={i}
                        position={slot.number}
                        title={getTeamName(slot)}
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
              }}>

                <div css={{ color: "rgba(0, 0, 0, .5)" }}>
                  Teams haven't been slotted for Round {this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)}
                </div>
                <p css={{ color: "green" }}>Please contact the organizers if this is a mistake.</p>
              </div>
            : <div css={{ textAlign: "center", }}>Please wait while we check for slots...</div>
        }
      </div>
    </div>
  );
};
