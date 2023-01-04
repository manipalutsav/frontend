import React, { Component } from "react";

import { Button } from "../../commons/Form";
import Select from "react-select";
import { CriteriaCard } from "../../commons/Card";
import { TeamList } from "../../commons/List";
import judges from "../../services/judges";
import events from "../../services/events";
import { toast } from "../../actions/toastActions";

export default class ViewJudgeSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      round: {},

      judgeOptions: [],
      judge: null,
      slots: [],
      selection: 0,
      scores: [],

      judgeSelected: false,
      criteria: [],

    };
  }

  componentWillMount = () => {

    this.init();

  };

  init = async () => {
    try {
      let judgesList = await judges.getAll();

      let scores = await events.getScores(this.props.event, this.props.round);
      this.setState({
        judgeOptions: judgesList.filter(i => scores[0].judges.find(judge => judge.id === i.id)).map(judge => ({ value: judge.id, label: judge.name })),
      })

      let slots = await events.getSlots2(this.props.event, this.props.round);
      events.get(this.props.event).then(event => {
        this.setState({ event });
      });

      events.getRound(this.props.event, this.props.round).then(round => {
        this.setState({ round, criteria: round.criteria });
      });

      slots.forEach(slot => {
        let score = scores.find(score => score.team === slot.id)
        slot.judges = score.judges;
      })

      this.setState({
        slots,
        selection: slots[0].number
      })
    } catch (e) {
      toast("Failed to load scoresheet: " + e);
      console.log(e);
    }
  }

  handleJudgeChange = (id) => {
    this.setState({
      judge: id,
    });
  };

  selectJudge = async () => {
    if (this.state.judge) {
      this.setState({
        judgeSelected: true
      })
    }
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
  getJudgeIndex = () => {
    let index = 0;
    for (let judge of this.state.slots[0].judges) {
      if (this.state.judge === judge.id) return index;
      index++;
    }
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
                    score={team.judges[this.getJudgeIndex()].points.reduce((acc, cur) => acc + cur) || 0}
                    slot={"#" + team.number}
                    name={team.team && team.team.name}
                    backgroundColor={team.number === this.state.selection ? "rgba(255, 209, 0, .2)" : "rgba(255, 193, 167, 0.53)"}
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
              <div>
                <h2>{this.state.event.name} - {"Round" + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1))}</h2>
                <h3>
                  Slot #{this.state.slots.length && this.state.slots[this.getSlotIndex(this.state.selection)] && this.state.slots[this.getSlotIndex(this.state.selection)].number}&ensp;

                </h3>
              </div>
              <div css={{
                color: "#ff5800",
                fontSize: "1.5em"
              }}>
                {(this.state.slots[this.getSlotIndex(this.state.selection)] && this.state.slots[this.getSlotIndex(this.state.selection)].judges[this.getJudgeIndex()] && this.state.slots[this.getSlotIndex(this.state.selection)].judges[this.getJudgeIndex()].points.reduce((acc, cur) => acc + cur)) || 0} Points
              </div>


              <div css={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {
                  this.state.criteria.length === 0
                    ? <CriteriaCard
                      title="Score"
                      onChange={this.handelCritriaChange}
                      value={((this.state.selection && this.state.slots[this.getSlotIndex(this.state.selection)].judges[this.getJudgeIndex(this.state.judge)].points[0]) || "0")}
                      name={0}
                    />
                    : this.state.criteria.map((criterion, i) => (
                      <CriteriaCard
                        disabled={true}
                        key={i}
                        title={criterion}
                        value={((this.state.selection && this.state.slots[this.getSlotIndex(this.state.selection)].judges[this.getJudgeIndex(this.state.judge)].points[i]) || "0")}
                        name={i}

                      />
                    ))
                }
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
                >View Scoresheet</Button>
              </div>
            </div>
          </div>
      }
    </div>
  )
};
