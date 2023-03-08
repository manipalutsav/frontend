import React, { Component } from "react";
import { navigate } from "gatsby";

import { Button } from "../../commons/Form";
import Select from "react-select";
import { CriteriaCard } from "../../commons/Card";
import { TeamList } from "../../commons/List";
import judges from "../../services/judges";
import events from "../../services/events";
import eventsService from "../../services/events";
import { toast } from "../../actions/toastActions";
import Block from "../../commons/Block";

export default class Judge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      round: {},

      judgeOptions: [],
      judge: null,
      slots: [],
      selection: null,
      submitted: false,
      judgeSelected: false,
      criteria: [],
      ...JSON.parse(localStorage.getItem("scoresheet:" + this.props.round)) || {}
    };
  }

  componentWillMount = () => {
    judges.getAll().then(judges => this.setState({
      judgeOptions: judges.map(judge => ({ value: judge.id, label: judge.name })),
      judges
    }));
  };

  handleJudgeChange = (id) => {
    this.setState({
      judge: id,
    });
  };

  selectJudge = async () => {
    if (this.state.judge) {

      let judge = this.state.judges.find(judge => judge.id == this.state.judge)
      if (judge.rounds.includes(this.props.round)) {
        alert("Selected judge has already submitted scoresheet for the round.")
        return;
      }


      //comment
      eventsService.getSlots2(this.props.event, this.props.round).then(slots => {
        eventsService.getTeams(this.props.event).then(teams => {

          slots = slots.filter(slot => teams.find(team => team.index === slot.teamIndex && team.college._id === slot.college._id));

          slots.map(team => team.points = []);
          this.setState({
            slots,
            selection: slots[0] && slots[0].number
          });
        });
      });

      events.get(this.props.event).then(event => {
        this.setState({ event });
      });

      events.getRound(this.props.event, this.props.round).then(round => {
        this.setState({ round, criteria: round.criteria });
      });

      this.setState({
        judgeSelected: true
      })
    }
  };

  handelCritriaChange = async (event, criterion) => {
    let { name, value } = event;

    if (value < 0 || value > criterion.weightage) {
      return toast(`Score cannot be above ${criterion.weightage} or below 0`);
    }


    let teams = this.state.slots;

    if (!teams[this.getSlotIndex(this.state.selection)].points.length) teams[this.getSlotIndex(this.state.selection)].points = new Array(this.state.criteria.length).fill(null);

    // teams[this.getSlotIndex(this.state.selection)].points[name] = parseFloat(parseFloat(value).toFixed(1));
    teams[this.getSlotIndex(this.state.selection)].points[name] = value.includes(".") && !value.endsWith(".5") ? value.split(".")[1] > 7 ? (parseInt(value.split(".")[0]) + 1) : value.split(".")[0] + (value.split(".")[1] < 3 ? "" : ".5") : value; // Yeah, tell me about it!

    let total = 0;

    for (let score of this.state.slots[this.getSlotIndex(this.state.selection)].points) {
      if (score) total += parseFloat(parseFloat(score).toFixed(1));
    }

    teams[this.getSlotIndex(this.state.selection)].total = total;

    await this.setState({
      slots: teams
    }, () => {
      let finished = true;
      this.state.slots.forEach(slot => {
        if (slot.points.length === 0) {
          finished = false;
          return;
        }
        slot.points.forEach(point => {

          if (point === "" || point === null) {
            finished = false;
          }
        })
      })

      this.setState({
        submitVisible: finished
      });
      localStorage.setItem("scoresheet:" + this.props.round, JSON.stringify(this.state));
    })
  };

  changeTeam = (team) => {
    this.setState({
      selection: team.number,
    });
  };

  getSlotIndex = (number) => {
    let index = 0;
    for (let slot of this.state.slots) {
      if (slot.number === number) return index;
      index++;
    }
  }
  handleNoteChange = async (event) => {

    let index = event.target.name;
    let slots = this.state.slots;
    slots[this.getSlotIndex(Number(index))].notes = event.target.value

    await this.setState({
      slots
    });
    localStorage.setItem("scoresheet:" + this.props.round, JSON.stringify(this.state));

  }
  submitScore = () => {
    let surity = typeof window !== "undefined"
      && window.confirm("Are you sure you want to submit the scores?\nOnce submitted, scores can't be edited.");

    if (!surity) {
      return;
    }

    let scores = this.state.slots.map(slot => ({
      points: slot.points.map(i => Number(i)),
      // judge: this.state.judge,
      slot: slot.id,
      // round: slot.round,
    }));

    events.createScores(this.props.event, this.props.round, this.state.judge, scores).then(res => {
      if (res) {
        //verify the scores are saved to the server.
        events.getScores(this.props.event, this.props.round, this.state.judge).then(scores2 => {

          //failed when could not find all slots saved
          let failed = scores.find(score => !scores2.find(score2 => score.slot == score2.slot && JSON.stringify(score.points) == JSON.stringify(score2.points)));

          if (!failed) {
            localStorage.removeItem("scoresheet:" + this.props.round);
            navigate("/events/" + this.props.event + "/rounds");
          }
          else {
            typeof window !== "undefined"
              && window.confirm("CRITICAL[1]: Failed to update judge scores on the server, keep a backup from side menu and contact help.");
          }
        });

      }
      else {
        typeof window !== "undefined"
          && window.confirm("CRITICAL[2]: Failed to update judge scores on the server, keep a backup from side menu and contact help.");
      }
    })
  };

  cancelJudging = () => {
    let surity = typeof window !== "undefined"
      && window.confirm("Are you sure you want to cancel juding? All your progress will be deleted!");

    if (!surity) {
      return;
    }
    localStorage.removeItem("scoresheet:" + this.props.round);
    navigate("/events/" + this.props.event + "/rounds");
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render = () => (
    <div>
      {
        this.state.judgeSelected
          ? <div css={{
            display: "flex",
          }}>
            <div css={{
              position: "sticky",
              width: "25%",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              flex: 1,
            }}>
              <div css={{
                fontSize: "0.8em",
                textAlign: "center",
                fontWeight: "900",
                color: "#ff5800",
              }}>Judge: {this.state.judgeOptions.find(judge => judge.value === this.state.judge).label}</div>
              {
                this.state.slots.map((team, i) => (
                  <TeamList
                    key={i}
                    scoreVisibility={this.state.hideTotalScore ? "hidden" : "visible"}
                    score={team.total || 0}
                    slot={"#" + team.number}
                    name={team.team && team.team.name}
                    backgroundColor={team.number === this.state.selection ? "rgba(255, 209, 0, .2)" :
                      (team.points.length !== 0 && !team.points.includes(null) && !team.points.includes("") ? "rgba(255, 193, 167, 0.53)" : "")
                    }
                    onClick={() => this.changeTeam(team)}
                  />
                ))
              }
            </div>

            <div css={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              flex: 3,
            }}>
              <div css={{ textAlign: "left" }}>
                <input type="checkbox" onClick={() => this.setState({ hideTotalScore: !this.state.hideTotalScore })} />Hide total scores
              </div>
              <div>
                <h2 className="mucapp">{this.state.event.name} - {"Round" + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1))}</h2>
                <h3 className="mucapp">
                  Slot #{this.state.slots.length && this.state.slots[this.getSlotIndex(this.state.selection)] && this.state.slots[this.getSlotIndex(this.state.selection)].number}&ensp;
                </h3>
              </div>
              <div css={{
                color: "#ff5800",
                fontSize: "1.5em",
                visibility: this.state.hideTotalScore ? "hidden" : "visible"
              }}>
                {(this.state.slots.length && this.state.slots[this.getSlotIndex(this.state.selection)] && this.state.slots[this.getSlotIndex(this.state.selection)].total && this.state.slots[this.getSlotIndex(this.state.selection)].total.toFixed(1)) || 0} out of {this.state.criteria.map(criterion => criterion.weightage).reduce((w1, w2) => w1 + w2, 0)}
              </div>


              <div css={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {
                  this.state.criteria.map((criterionObj, i) => (
                    <CriteriaCard
                      key={i}
                      criterion={criterionObj}
                      onChange={(event) => this.handelCritriaChange(event, criterionObj)}
                      value={((this.state.selection && this.state.slots[this.getSlotIndex(this.state.selection)].points[i]) || "")}
                      name={i}

                    />
                  ))
                }
              </div>

              <textarea
                onChange={this.handleNoteChange}
                css={{ margin: "20px auto", minWidth: "50%", maxWidth: "70%", border: "1px solid #DDD", padding: 5, height: 200 }}
                placeholder="You can write some notes here for this slot number to reference it later. Notes will be cleared once you submit the scores."
                name={this.state.selection}
                value={((this.state.selection && this.state.slots[this.getSlotIndex(this.state.selection)].notes) || "")}
              ></textarea>
              <Block show={this.state.submitVisible}>
                <Button styles={{ marginTop: 16, }} onClick={this.submitScore} style={{}}>Submit</Button>
              </Block>

              <p css={{
                display: "flex",
                flexDirection: "column",
                fontSize: "0.9em",
                whiteSpace: "pre-wrap",
              }}>
                <h3>Event Description:</h3>
                {this.state.event.description}
              </p>
              <div>
                <Button styles={{ marginTop: 16, backgroundColor: "#ff4a4a" }} onClick={this.cancelJudging} style={{}}>Cancel Judging</Button>
              </div>
            </div>

          </div>
          : <div css={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div css={{
              width: 350,
              padding: 20,
              borderRadius: 5,
              boxShadow: "0 10px 50px -10px rgba(0, 0, 0, .2)",
            }}>
              <div css={{
                textAlign: "center",
                marginBottom: "16px",
              }}>Select Judge</div>

              <div css={{
                display: "flex",
                flexDirection: "column",
              }}>
                <Select
                  // value={this.state.judge}
                  onChange={(selected) => this.handleJudgeChange(selected.value)}
                  options={this.state.judgeOptions}
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
                    marginBottom: "16px",
                  }}
                  isSearchable={true}
                  name="Judge"
                />
              </div>

              <div>
                <Button
                  disabled={!this.state.judge}
                  onClick={this.selectJudge}
                  styles={{ width: "100%" }}
                >Start Round</Button>
              </div>
            </div>
          </div>
      }
    </div>
  )
};
