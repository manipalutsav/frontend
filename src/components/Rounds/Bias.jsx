import React from "react";

import leaderboardService from "../../services/leaderboard";
import eventService from "../../services/events";
import { Button } from "../../commons/Form";
import Dialog from "../../commons/Dialog";
import { navigate } from "gatsby";
import { getTeamName } from "../../utils/common";

export default class Bias extends React.Component {
  BUTTON_NORMAL = "Save";
  BUTTON_CLICKED = "Saving...";

  constructor(props) {
    super(props);

    this.state = {
      event: {},
      scoreStatus: false,
      loaded: false,
      slots: [],
      button: this.BUTTON_NORMAL,
    };

    this.handleOvertime = this.handleOvertime.bind(this);
    this.confirmDisqualify = this.confirmDisqualify.bind(this);
    this.handleDisqualifcation = this.handleDisqualifcation.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  // componentWillMount = () => {
  //   eventService.get(this.props.event).then(event => this.setState({ event }));

  //   eventService.getSlots2(this.props.event, this.props.round).then(slots =>
  //     leaderboardService.getRound(this.props.event, this.props.round).then(lb => {
  //       if (!lb.length) return;

  //       let teams = slots;

  //       for (let team of teams) {

  //         let score = lb.find(score => score.team.teamIndex === team.teamIndex && score.team.college._id === team.college._id);


  //         if (!score)
  //           continue;

  //         team.points = score.judgePoints || 0;
  //         // team.points = score.points || 0;
  //         team.overtime = score.overtime || 0;
  //         team.bias = score.bias;
  //         team.total = score.points;
  //         console.log(team);
  //       }

  //       this.setState({ teams, scoreStatus: true });
  //     })
  //   );
  // }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      let event = await eventService.get(this.props.event);
      let round = await eventService.getRound(this.props.event, this.props.round);
      let slots = await eventService.getSlots2(this.props.event, this.props.round);
      let leaderboard = await leaderboardService.getRound(this.props.event, this.props.round);
      slots.forEach(slot => {
        let leaderboardItem = leaderboard.find(item => item.slot._id == slot.id);

        slot.judgePoints = leaderboardItem ? leaderboardItem.total : 0;
        slot.total = slot.judgePoints - this.getOvertimeMinusPoints(slot.overtime);
      })
      slots.sort((a,b)=>b.judgePoints - a.judgePoints)
      this.setState({ event, round, slots })
    } catch (error) {
      console.log(error)
    }
  }

  getOvertimeMinusPoints(overtime) {
    return overtime > 0 ? 5 * (Math.ceil(overtime / 15)) : 0;
  }

  handleOvertime(event) {
    let slots = this.state.slots;
    let number = Number(event.target.name.replace("overtime-", ""));
    let slot = slots.find(slot => slot.number === number);

    slot.overtime = Number(event.target.value);
    slot.total = slot.judgePoints - this.getOvertimeMinusPoints(slot.overtime);
    this.setState({ slots });
  }

  confirmDisqualify(number) {
    let slots = this.state.slots;
    let slot = slots.find(slot => slot.number === number);

    this.setState({
      disqualifyNumber: number,
      dialogBody: "Are you sure you want to disqualify " + getTeamName(slot) + "?",
      showDialog: true,
    });
  }

  handleDisqualifcation() {
    let slots = this.state.slots;
    let slot = slots.find(slot => slot.number === this.state.disqualifyNumber);
    slot.disqualified = true;

    this.setState({
      teams: slots,
      showDialog: false,
    });
  }

  handleSave() {
    let slots = this.state.slots.map(slot => ({
      id: slot.id,
      overtime: slot.overtime,
      disqualified: slot.disqualified,
    }));

    this.setState(
      { button: this.BUTTON_CLICKED },
      () =>
        eventService.updateSlotBias(this.props.event, this.props.round, slots).then(res => {
          if (res) navigate(`/events/${this.props.event}/rounds`);
          this.setState({ button: this.BUTTON_NORMAL });
        })
    );
  }

  render = () => (
    <div>
      <div>
        <h1 className="mucapp" style={{ textAlign: "left" }}>{this.state.event.name} - Round {this.state.event.rounds && this.state.event.rounds.indexOf(this.props.round) + 1}</h1>
      </div>
      <div>
        {
          this.state.slots.length
            ? <>
              <table css={{
                width: "100%",
                borderCollapse: "collapse",
              }}>
                <thead>
                  <tr>
                    <th>Slot No.</th>
                    <th>Team Name</th>
                    <th>Judges' Score</th>
                    <th>Overtime (Seconds)</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.slots.map((slot, index) => (
                      <tr
                        key={index}
                        style={{ textAlign: "center" }}
                        css={
                          false
                            ? { color: "#900", background: "rgba(250, 0, 0, .1)" }
                            : {}
                        }
                      >
                        <td>{slot.number}</td>
                        <td>{getTeamName(slot)}</td>
                        <td>{slot.judgePoints}</td>
                        <td>
                          <input
                            className="input input-bordered"
                            type="number"
                            name={`overtime-` + slot.number}
                            min="0"
                            onChange={this.handleOvertime}
                            value={this.state.slots[index].overtime}
                            css={{ width: 100, margin: 5, }}
                            disabled={/*slot.team.disqualified*/false}
                          />
                        </td>
                        <td>{slot.total}</td>
                        <td>
                          {
                            slot.disqualified

                              ? "Disqualified"
                              : <Button onClick={() => this.confirmDisqualify(slot.number)}>Disqualify</Button>
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <div css={{ textAlign: "right", marginRight: "100px", marginTop: 10 }}>
                <Button onClick={this.handleSave} disabled={this.state.button === this.BUTTON_CLICKED}>{this.state.button}</Button>
              </div>
            </>
            : <h1 className="mucapp" style={{ textAlign: "center" }}>No results</h1>
        }

        <Dialog
          title="Confrim disqualification"
          body={this.state.dialogBody}
          positiveButton={{
            label: "Yes",
            handler: this.handleDisqualifcation
          }}
          negativeButton={{
            label: "No"
          }}
          show={this.state.showDialog}
        />
      </div >
    </div >
  );
};
