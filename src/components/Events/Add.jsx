import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import reducer from "../../reducers/commonReducer";
import { create } from "../../services/eventService";
import { Input, Button, TextArea } from "../../commons/Form";
import constants from "../../utils/constants";
import { getAll } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class AddEvent extends React.Component {

  types = (function () {
    let options = [];

    for (let userType in constants.USER_TYPES) {
      if (constants.USER_TYPES.hasOwnProperty(userType)) {
        options.push({
          label: userType.replace(/_/g, " "),
          value: constants.USER_TYPES[userType],
        });
      }
    }

    return options;
  }());
  ADD = "Add Event";
  ADDING = "Adding Event...";
  state = {
    buttonText: this.ADD,
    minMembersPerTeam: 1,
    maxMembersPerTeam: 1,
    maxTeamsPerCollege: 1
  };

  handleChange = (e) => {

    this.setState({ [e.name]: e.value }, () => {

    });
  };

  handleClick = () => {
    if (!this.state.name)
      return toast("Please enter name");
    if (!this.state.college)
      return toast("Please enter college");
    if (!this.state.minMembersPerTeam)
      return toast("Please enter minimum members per team");
    if (!this.state.maxMembersPerTeam)
      return toast("Please enter maximum members per team");
    if (!this.state.maxTeamsPerCollege)
      return toast("Please enter maximum teams per college");

    this.setState({
      buttonText: this.ADDING
    }, async () => {
      let response = await create({
        name: this.state.name,
        college: this.state.college,
        minMembersPerTeam: this.state.minMembersPerTeam,
        maxMembersPerTeam: this.state.maxMembersPerTeam,
        maxTeamsPerCollege: this.state.maxTeamsPerCollege,
        venue: this.state.venue,
        description: this.state.description,
        duration: this.state.duration,
        startDate: new Date(this.state.startDate),
        endDate: new Date(this.state.endDate),
        faculty: this.state.faculty,
        criteria: [this.state.criteria1, this.state.criteria2, this.state.criteria3, this.state.criteria4],
        slottable: true
      });
      if (!response)
        toast("Some error occured");
      else if (response.status === 200) {
        this.UNSUB();
        return navigate("/events");
      }
      else
        toast(response.message);
      this.setState({ buttonText: this.ADD })


    })



  };

  componentWillMount() {
    getAll();

    this.UNSUB = reducer.subscribe(() => {
      reducer.getState().then(state => {
        this.setState({
          colleges: state.data.list.map(college => ({
            value: college.id,
            label: college.name + ", " + college.location,
          })),
        });
      });
    });
  }

  render = () => (
    <div>
      <h2>Add Event</h2>
      <p>Add a new event to MUCAPP.</p>
      <div>
        <div>
          <label htmlFor="name">Name: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="name"
            id="name"
            type="text"
            value={this.state.name}
            placeholder="Name"
            required
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="college">College: </label>
          <Select
            isSearchable={false}
            name="college"
            id="college"
            placeholder="College"
            options={this.state.colleges}
            onChange={(e) => this.setState({ college: e.value })}
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
              display: 'inline-block',
              width: 300,
            }}
          />
        </div>
        <div>
          <label htmlFor="minMembersPerTeam">Minimum Members Per Team: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="minMembersPerTeam"
            id="minMembersPerTeam"
            type="number"
            placeholder="Minimum Members Per Team"
            required
            min="1"
            value={this.state.minMembersPerTeam}
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="maxMembersPerTeam">Maximum Members Per Team: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="maxMembersPerTeam"
            id="maxMembersPerTeam"
            type="number"
            placeholder="Maximum Members Per Team"
            min="1"
            value={this.state.maxMembersPerTeam}
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="maxTeamsPerCollege">Maximum Teams Per College: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="maxTeamsPerCollege"
            id="maxTeamsPerCollege"
            type="number"
            value={this.state.maxTeamsPerCollege}
            placeholder="Maximum Teams Per College"
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="venue">Venue: </label>
          <Select
            isSearchable={false}
            name="venue"
            id="venue"
            placeholder="Venue"
            options={[
              { label: 'Dr. TMA Pai Hall, 2nd Floor', value: 'Dr. TMA Pai Hall, 2nd Floor' },
              { label: 'Dr. TMA Pai Hall, 3rd Floor', value: 'Dr. TMA Pai Hall, 3rd Floor' },
              { label: 'Counselling Hall, manipal.edu', value: 'Counselling Hall, manipal.edu' },
              { label: 'MMMC, Manipal', value: 'MMMC, Manipal' },
              { label: 'KMC Greens, Main Stage', value: 'KMC Greens, Main Stage' },
              { label: 'KMC Greens, STEPS', value: 'KMC Greens, STEPS' },
              { label: 'WGSHA Kitchen', value: 'WGSHA, Kitchen' }
            ]}
            onChange={(e) => this.setState({ venue: e.value })}
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
          <label htmlFor="description">Description: </label>
          <TextArea
            onChange={this.handleChange}
            autoComplete="off"
            name="description"
            id="description"
            type="text"
            placeholder="Description"
            styles={{ maxWidth: 300, minWidth: 300 }}
          />
        </div>
        <div>
          <label htmlFor="duration">Duration in minutes: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="duration"
            id="duration"
            type="number"
            placeholder="Duration in minutes"
            styles={{ width: 300, verticalAlign: "top" }}
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date: </label>
          <Input
            type="datetime-local"
            name="startDate"
            id="startDate"
            value={this.state.startDate}
            onChange={this.handleChange}
          />

        </div>

        <div>
          <label htmlFor="endDate">End Date: </label>
          <Input
            type="datetime-local"
            name="endDate"
            id="endDate"
            value={this.state.endDate}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="type">For: </label>
          <Select
            isSearchable={false}
            name="type"
            id="type"
            placeholder="For"
            options={[{ label: 'Students', value: false }, { label: 'Faculty', value: true }]}
            onChange={(e) => this.setState({ faculty: e.value })}
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
          <label htmlFor="criteria1">Criteria 1: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria1"
            id="criteria1"
            placeholder="Criteria 1 "
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="criteria2">Criteria 2: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria2"
            id="criteria2"
            placeholder="Criteria 2 "
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="criteria3">Criteria 3: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria3"
            id="criteria3"
            placeholder="Criteria 3 "
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <label htmlFor="criteria4">Criteria 4: </label>
          <Input
            onChange={this.handleChange}
            autoComplete="off"
            name="criteria4"
            id="criteria4"
            placeholder="Criteria 4 "
            styles={{ width: 300 }}
          />
        </div>
        <div>
          <Button onClick={this.handleClick} disabled={this.state.buttonText === this.ADDING}>{this.state.buttonText}</Button>
        </div>
      </div>
    </div>
  );
};
