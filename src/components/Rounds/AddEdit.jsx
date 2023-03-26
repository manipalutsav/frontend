import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import eventsService from "../../services/events";

import { Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";
import { keyToDisplay, loop } from "../../utils/common";
import { buttonState } from "../../utils/constants";

export default class AddEditRound extends React.Component {
  state = {
    buttonText: this.getButtonState(buttonState.LOADED),
    event: {},
    slotType: "all",
    slotOrder: "random",
    criteria: [],
    criteriaCount: 4,
    loaded: false
  };

  getButtonState(state) { return buttonState[this.props.round ? "UPDATE" : "ADD"][state] }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    let event = await eventsService.get(this.props.event);
    this.setState({ event });
    if (this.props.round) {
      let round = await eventsService.getRound(this.props.event, this.props.round)
      let criteriaCount = round.criteria.length;
      this.setState({ ...round, criteriaCount, loaded: true })
    }
    else {
      this.setState({ loaded: true })
    }

  }

  handleCriteriaChange = (index, value) => {
    let criteria = this.state.criteria;
    if (!criteria[index])
      criteria[index] = {};
    criteria[index].criterion = value;
    this.setState({ criteria });
  }

  handleWeightageChange = (index, value) => {
    let criteria = this.state.criteria;
    if (!criteria[index])
      criteria[index] = {};
    criteria[index].weightage = value;
    this.setState({ criteria });
  }

  handleCriteriaCountChange = (value) => {
    let criteriaCount = Number(value);
    let criteria = this.state.criteria.splice(0, criteriaCount);
    this.setState({ criteriaCount, criteria })
  }

  handleForChange = (value) => {
    this.setState({ slotType: value })
  }

  handleOrderChange = (value) => {
    this.setState({ slotOrder: value })
  }

  handleSubmit = async () => {
    try {
      this.setState({ buttonText: this.getButtonState(buttonState.LOADING) })

      let { criteriaCount, criteria, slotType, slotOrder } = this.state;
      for (let index = 0; index < criteriaCount; index++) {
        if (!criteria[index] || !criteria[index].criterion)
          throw Error("Please enter criteria " + (index + 1));
        if (String(criteria[index].criterion).trim().length === 0)
          throw Error("Criteria " + (index + 1) + " cannot be blank");
      }

      let round = {
        criteria,
        slotType,
        slotOrder
      };

      if (this.props.round) {
        await eventsService.updateRound(this.props.event, this.props.round, round);
      }
      else {
        await eventsService.createRound(this.props.event, round);
      }
      navigate(`/events/${this.props.event}/rounds`)
    }
    catch (error) {
      toast(error.message);
      this.setState({ buttonText: this.getButtonState(buttonState.LOADED) })
    }
  }

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">Add rounds to {this.state.event.name}</h2>
      </div>

      <div className="pt-5 pb-5">
        <div>Number of criteria</div>
        <input
          onChange={(e) => this.handleCriteriaCountChange(e.target.value)}
          autoComplete="off"
          name="criteriaCount"
          type="number"
          className="input input-bordered input-accent w-full max-w-xs"
          min="0"
          value={this.state.criteriaCount}
          placeholder="Count"
          css={{ width: 300 }}
        />
      </div>
      {loop(this.state.criteriaCount).map((_, index) =>
        <div key={index} className="pt-5 pb-5">
          <div>Criteria {index + 1}</div>
          <input
            onChange={(e) => this.handleCriteriaChange(index, e.target.value)}
            autoComplete="off"
            type="text"
            className="input input-bordered input-accent w-full max-w-xs"
            defaultValue={this.state.criteria[index] ? this.state.criteria[index].criterion : ""}
            placeholder={`Criteria ${index + 1}`}
            css={{ width: 300 }}
          />
          <div>Weightage</div>
          <input
            onChange={(e) => this.handleWeightageChange(index, e.target.value)}
            autoComplete="off"
            type="text"
            className="input input-bordered input-accent w-full max-w-xs"
            defaultValue={this.state.criteria[index] ? this.state.criteria[index].weightage : "10"}
            placeholder={`Weightage`}
            css={{ width: 300 }}
          />
        </div>)}

      <div>
        <div>Type</div>
        <Select
          isSearchable={false}
          name="type"
          placeholder="Type"
          value={{
            label: keyToDisplay(this.state.slotType),
            value: this.state.slotType,
          }}
          options={[
            { label: "All", value: "all" },
            { label: "Registered", value: "registered" },
          ]}
          onChange={(e) => this.handleForChange(e.value)}
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
        <div>Order</div>
        <Select
          isSearchable={false}
          name="order"
          placeholder="Order"
          value={{
            label: keyToDisplay(this.state.slotOrder),
            value: this.state.slotOrder,
          }}
          options={[
            { label: "Asc", value: "asc" },
            { label: "Desc", value: "desc" },
            { label: "Random", value: "random" },
          ]}
          onChange={(e) => this.handleOrderChange(e.value)}
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
          onClick={this.handleSubmit}
          disabled={String(this.state.buttonText).endsWith("...")}
        >
          {this.state.buttonText}
        </Button>
      </div>
    </div>
  );
};
