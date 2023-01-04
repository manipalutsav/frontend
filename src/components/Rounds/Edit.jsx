import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import eventsService from "../../services/events";

import { Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";

export default class EditRound extends React.Component {
  ADD = "Update";
  ADDING = "Updating...";

  state = {
    buttonText: this.ADD,
    event: {},
    round: {},
  };

  handleChange = (e) => {
    this.setState({
      round: {
        ...this.state.round,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleClick = () => {
    if (!this.state.round.criteria1) return toast("Please enter criteria 1");

    let criteria = [this.state.round.criteria1];

    if (this.state.round.criteria2 && this.state.round.criteria2.trim().length)
      criteria.push(this.state.round.criteria2.trim());
    if (this.state.round.criteria3 && this.state.round.criteria3.trim().length)
      criteria.push(this.state.round.criteria3.trim());
    if (this.state.round.criteria4 && this.state.round.criteria4.trim().length)
      criteria.push(this.state.round.criteria4.trim());


    this.setState({
      buttonText: this.ADDING
    }, () => {
      let round = {
        criteria,
        slottable: !!this.state.round.slottable,
      };

      eventsService.updateRound(this.props.event, this.props.round, round).then(() => {
        navigate("/events/" + this.props.event + "/rounds");
      }).catch(() =>
        this.setState({ buttonText: this.ADD })
      );
    });
  };

  componentWillMount() {
    eventsService.get(this.props.event).then(event =>
      this.setState({ event, })
    );
    eventsService.getRound(this.props.event, this.props.round).then(round => {
      this.setState({
        round: {
          criteria1: round.criteria[0],
          criteria2: round.criteria[1],
          criteria3: round.criteria[2],
          criteria4: round.criteria[3],
          slottable: round.slottable
        },
        roundID: round.id

      });
    })
  }

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">Edit {this.state.event.name} Round</h2>
      </div>

      <div>
        <div>
          <div>Criteria 1</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria1"
            type="text"
            value={this.state.round.criteria1 || ""}
            placeholder="Criteria 1"
            css={{ width: 300 }}
          />
        </div>

        <div>
          <div>Criteria 2</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria2"
            type="text"
            value={this.state.round.criteria2 || ""}
            placeholder="Criteria 1"
            css={{ width: 300 }}
          />
        </div>

        <div>
          <div>Criteria 3</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria3"
            type="text"
            value={this.state.round.criteria3 || ""}
            placeholder="Criteria 1"
            css={{ width: 300 }}
          />
        </div>

        <div>
          <div>Criteria 4</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria4"
            type="text"
            value={this.state.round.criteria4 || ""}
            placeholder="Criteria 1"
            css={{ width: 300 }}
          />
        </div>

        <div>
          <div>Slottable</div>
          <Select
            isSearchable={false}
            name="slottable"
            placeholder="Slottable"
            value={{
              label: this.state.round.slottable ? "Slottable" : "Not Slottable",
              value: this.state.round.slottable ? true : false,
            }}
            options={[
              { label: "Slottable", value: true },
              { label: "Not Slottable", value: false },
            ]}
            onChange={(e) => this.setState({ round: { ...this.state.round, slottable: e.value } })}
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
              width: 300,
              display: 'inline-block'
            }}
          />
        </div>

        <div>
          <Button
            onClick={this.handleClick}
            disabled={this.state.buttonText === this.ADDING}
          >
            {this.state.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
