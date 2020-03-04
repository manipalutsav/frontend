import React from "react";
import Select from "react-select";

import eventsService from "../../services/events";
import collegesService from "../../services/colleges"
import LBList from "../../commons/LBList";

export default class extends React.Component {
  constructor(props){
    super(props);

    this.slots = [];
    this.loadData=this.loadData.bind(this);
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
    this.loadData();
  }
  async loadData(){
    let event = await eventsService.get(this.props.event);
    await this.setState({
      event,
      round: event.rounds[0],
      roundOptions: event.rounds.map((round, i) => ({
        label: "Round " + (i + 1),
        value: round,
      }))
    });
    
    let slots = await eventsService.getSlots(this.props.event, this.state.round);
    console.log(slots);
    let newSlots=[];
    for(let i=0;i<slots.length;i++){
      let slot=slots[i];
      let number = slot.number;
      let name = slot.team.name;
      if(event.maxMembersPerTeam===1){
        let participants = await collegesService.getParticipants(slot.team.college)
        let participant=participants.find(participant=>slot.team.members.includes(participant.id));
        let college = name.match(/[\w\s-,.]*/)[0];
        name = `${participant.name}, ${college}`;
      }
      if(event.maxTeamsPerCollege===1){
        name = name.match(/[\w\s-,.]*/)[0];
        
      }
     newSlots.push({number,name}); 
    }
    await this.setState({ slotted: !!slots.length, slots:newSlots });
    this.setState({ loaded: true });
  
  }

  handleRoundChange = (e) => {
    this.setState(
      { round: e.value, loaded: false, },
      () =>
        eventsService.getSlots(this.props.event, this.state.round).then(slots =>
          this.setState({ slotted: !!slots.length, slots }, () =>
            this.setState({ loaded: true })
          )
        )
    );
  }

  showPDF = () => {
    if (typeof document !== "undefined") {
      let slots = document.getElementById("slots").innerHTML;
      let printWindow = window.open("", "", "height=500,width=800");

      printWindow.document.write("<html><head>");
      printWindow.document.write("<title>" + this.state.event.name + " Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)) + " - Slots</title>");
      printWindow.document.write("<style>body{font-family:sans-serif;}body>div{display:flex;justify-content:space-between;padding:5px;border-bottom:1px dashed #bbb;}h1{text-align:center;}</style>");
      printWindow.document.write("</head><body>");
      printWindow.document.write("<h1>" + this.state.event.name + " Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)) + " - Slots</h1>");
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
        <h2>
          { this.state.event.name } Slots
        </h2>
        <div>
          <Select
            isSearchable={ false }
            name="round"
            placeholder="Select Round"
            value={{ label: "Round " + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1)), value: this.state.round }}
            options={ this.state.roundOptions }
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
            css = {{
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
                  <button onClick={ this.showPDF }>Generate PDF</button>
                </div>
                <div id="slots">
                  {
                    this.state.slots.map((slot, i) =>
                      <LBList
                        key={ i }
                        position={ slot.number }
                        title={ slot.name }
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
                <h2>{ this.state.event.name }</h2>
                <div css={{ color: "rgba(0, 0, 0, .5)" }}>
                  Teams haven't been slotted for Round { this.state.event.rounds && (this.state.event.rounds.indexOf(this.state.round) + 1) }
                </div>
                <p css={{ color: "green" }}>Please contact the organizers if this is a mistake.</p>
              </div>
          : <div css={{ textAlign: "center", }}>Please wait while we check for slots...</div>
        }
      </div>
    </div>
  );
};
