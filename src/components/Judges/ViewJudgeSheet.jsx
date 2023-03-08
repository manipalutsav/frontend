import React, { Component } from "react";

import { Button } from "../../commons/Form";
import Select from "react-select";
import { CriteriaCard } from "../../commons/Card";
import { TeamList } from "../../commons/List";
import judges from "../../services/judges";
import events from "../../services/events";
import { toast } from "../../actions/toastActions";
import { getTeamName } from "../../utils/common";

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
      let judgesList = await judges.getForRound(this.props.round);
      let event = await events.get(this.props.event);
      let round = await events.getRound(this.props.event, this.props.round);
      this.setState({
        judgeOptions: judgesList.map(judge => ({ value: judge.id, label: judge.name })),
        event,
        round
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
      let scores = await events.getScores(this.props.event, this.props.round, this.state.judge);
      let slots = await events.getSlots2(this.props.event, this.props.round);

      scores.forEach(score => {
        score.slot = slots.find(slot => slot.id == score.slot);
      })

      scores.sort((s1, s2) => s1.slot.number - s2.slot.number)
      this.setState({
        scores,
        judgeSelected: true,
        selection: scores.length > 0 ? scores[0].slot.number : 0
      })
    }
  };


  changeTeam = (score) => {
    this.setState({
      selection: score.slot.number,
    });
  };

  getSlotIndex = (number) => {
    let index = 0;
    for (let score of this.state.scores) {
      if (score.slot.number === number) return index;
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
    <div >
      {console.log(this.state)}
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
                this.state.scores.map((score, i) => (
                  <TeamList
                    key={i}
                    score={score.points.reduce((acc, cur) => acc + cur) || 0}
                    slot={"#" + score.slot.number}
                    backgroundColor={score.slot.number === this.state.selection ? "rgba(0, 209, 0, .2)" : "rgba(255, 193, 167, 0.53)"}
                    onClick={() => this.changeTeam(score)}
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
                <h2 className="mucapp">{this.state.event.name} - {"Round" + (this.state.event.rounds && (this.state.event.rounds.indexOf(this.props.round) + 1))}</h2>
                <h3 className="mucapp">
                  Slot #{this.state.scores.length && this.state.scores[this.getSlotIndex(this.state.selection)] && this.state.scores[this.getSlotIndex(this.state.selection)].slot.number}&ensp;
                </h3>
              </div>
              <div css={{
                color: "#ff5800",
                fontSize: "1.5em"
              }}>
                {this.state.scores[this.getSlotIndex(this.state.selection)].points.reduce((acc, cur) => acc + cur, 0)} out of {this.state.round.criteria.map(criterion => criterion.weightage).reduce((w1, w2) => w1 + w2, 0)}
              </div>


              <div css={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {
                  this.state.round.criteria.map((criterionObj, i) => (
                    <CriteriaCard
                      disabled={true}
                      key={i}
                      criterion={criterionObj}
                      value={((this.state.scores[this.getSlotIndex(this.state.selection)].points[i]) || "0")}
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
