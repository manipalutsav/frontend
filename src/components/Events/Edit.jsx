import React from "react";
import { navigate } from "gatsby";
import Select from "react-select";

import eventsService from "../../services/events";
import collegesService from "../../services/colleges";

import { edit } from "../../services/eventService";
import { Input, Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

export default class EditEvent extends React.Component {
  UPDATE = "Update";
  UPDATING = "Updating...";

  state = {
    buttonText: this.UPDATE,
    event: {},
    colleges: [],
    timezoneOffset: new Date().getTimezoneOffset() * 60 * 1000,
  };

  handleChange = (e) => {
    this.setState({
      event: {
        ...this.state.event,
        [e.target.name]: e.target.name.endsWith("Date") ? new Date(e.target.value + "Z").toISOString() : e.target.value,
      },
    });
  };

  handleClick = () => {
    if (!this.state.event.name) return toast("Please enter name");
    if (!this.state.event.college) return toast("Please enter college");
    if (!this.state.event.minMembersPerTeam) return toast("Please enter minimum members per team");
    if (!this.state.event.maxMembersPerTeam) return toast("Please enter maximum members per team");
    if (!this.state.event.maxTeamsPerCollege) return toast("Please enter maximum teams per college");

    this.setState({
      buttonText: this.UPDATING
    }, async () => {
      let response = await edit(this.props.event, {
        name: this.state.event.name,
        college: this.state.event.college,
        minMembersPerTeam: this.state.event.minMembersPerTeam,
        maxMembersPerTeam: this.state.event.maxMembersPerTeam,
        maxTeamsPerCollege: this.state.event.maxTeamsPerCollege,
        venue: this.state.event.venue,
        description: this.state.event.description,
        duration: this.state.event.duration,
        startDate: new Date(new Date(this.state.event.startDate).getTime() + this.state.timezoneOffset).toISOString(),
        endDate: new Date(new Date(this.state.event.endDate).getTime() + this.state.timezoneOffset).toISOString(),
        faculty: this.state.event.faculty,
        registrationStartDate: this.state.event.registrationStartDate ? new Date(new Date(this.state.event.registrationStartDate).getTime() + this.state.timezoneOffset).toISOString() : undefined,
        registrationEndDate: this.state.event.registrationEndDate ? new Date(new Date(this.state.event.registrationEndDate).getTime() + this.state.timezoneOffset).toISOString() : undefined,
      });

      if (!response) toast("Some error occured");
      else if (response.status === 200) return navigate("/events");
      else toast(response.message);

      this.setState({ buttonText: this.UPDATE });
    });
  };

  componentWillMount() {
    eventsService.get(this.props.event).then(event => {
      this.setState({
        event: {
          name: event.name,
          college: event.college._id,
          minMembersPerTeam: event.minMembersPerTeam,
          maxMembersPerTeam: event.maxMembersPerTeam,
          maxTeamsPerCollege: event.maxTeamsPerCollege,
          venue: event.venue,
          description: event.description,
          duration: event.duration,
          startDate: new Date(new Date(event.startDate).getTime() - this.state.timezoneOffset).toISOString(),
          endDate: new Date(new Date(event.endDate).getTime() - this.state.timezoneOffset).toISOString(),
          faculty: event.faculty,
          registrationStartDate: event.registrationStartDate ? new Date(new Date(event.registrationStartDate).getTime() - this.state.timezoneOffset).toISOString() : "",
          registrationEndDate: event.registrationStartDate ? new Date(new Date(event.registrationEndDate).getTime() - this.state.timezoneOffset).toISOString() : "",
        },
      });
    });

    collegesService.getAll().then(colleges => this.setState({
      colleges: colleges.map(college => ({
        label: college.name + ", " + college.location,
        value: college.id,
      })),
    }));
  }

  getCollege() {
    let college = this.state.event.college;
    if (!college || this.state.colleges.length === 0) return "";
    college = this.state.colleges.find(clg => clg.value === college);
    return college ? college : '';
  }

  render = () => (
    <div>
      <div>
        <h2 className="mucapp">Edit Event</h2>
        <p>Editing the event {this.state.event.name}.</p>
      </div>

      <div>
        <div>
          <div>Name</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="name"
            type="text"
            value={this.state.event.name || ""}
            placeholder="Name"
            required
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>College</div>
          <Select
            isSearchable={false}
            name="college"
            value={this.getCollege() || ""}
            placeholder="College"
            options={this.state.colleges}
            onChange={(e) => this.setState({ event: { ...this.state.event, college: e.value } })}
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
          <div>Minimum Members Per Team</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="minMembersPerTeam"
            type="number"
            placeholder="Minimum Members Per Team"
            min="1"
            required
            value={this.state.event.minMembersPerTeam || 1}
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Maximum Members Per Team</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="maxMembersPerTeam"
            type="number"
            placeholder="Maximum Members Per Team"
            min="1"
            required
            value={this.state.event.maxMembersPerTeam || 1}
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Maximum Teams Per College</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="maxTeamsPerCollege"
            type="number"
            placeholder="Maximum Teams Per Team"
            min="1"
            required
            value={this.state.event.maxTeamsPerCollege || 1}
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Venue</div>
          <Select
            isSearchable={false}
            name="venue"
            placeholder="Venue"
            value={{ label: this.state.event.venue || "", value: this.state.event.venue || "" }}
            options={[
              { label: "Dr. TMA Pai Hall, 1st Floor", value: "Dr. TMA Pai Hall, 1st Floor" },
              { label: "Dr. TMA Pai Hall, 2nd Floor", value: "Dr. TMA Pai Hall, 2nd Floor" },
              { label: "Dr. TMA Pai Hall, 3rd Floor", value: "Dr. TMA Pai Hall, 3rd Floor" },
              { label: "Counselling Hall, manipal.edu", value: "Counselling Hall, manipal.edu" },
              { label: "MMMC, Manipal", value: "MMMC, Manipal" },
              { label: "KMC Greens, Main Stage", value: "KMC Greens, Main Stage" },
              { label: "KMC Greens, STEPS", value: "KMC Greens, STEPS" },
              { label: "KMC Food Court, 2nd floor", value: "KMC Food Court, 2nd floor" },
              { label: "WGSHA Kitchen", value: "WGSHA, Kitchen" },
              { label: "Sharada Hall, MCHP", value: "Sharada Hall, MCHP" },
              { label: "DBMS/MMMC (3rd Floor - Digi Lab)", value: "DBMS/MMMC (3rd Floor - Digi Lab)" },
              { label: "Biochemistry LH – 1", value: "Biochemistry LH – 1" },
            ]}
            onChange={(e) => this.setState({ event: { ...this.state.event, venue: e.value } })}
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
          <div>Description</div>
          <textarea
            onChange={this.handleChange}
            autoComplete="off"
            name="description"
            type="text"
            placeholder="Description"
            css={{ width: 300, height: 200, maxWidth: "100%", }}
            value={this.state.event.description || ""}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Duration per team (minutes)</div>
          <input
            onChange={this.handleChange}
            autoComplete="off"
            name="duration"
            type="number"
            placeholder="Duration"
            min="1"
            required
            value={this.state.event.duration || 0}
            css={{ width: 300 }}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>Start Date</div>
          <input
            autoComplete="off"
            name="startDate"
            type="datetime-local"
            value={(this.state.event.startDate && this.state.event.startDate.split("Z")[0]) || ""}
            onChange={this.handleChange}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>End Date</div>
          <input
            autoComplete="off"
            name="endDate"
            type="datetime-local"
            value={(this.state.event.endDate && this.state.event.endDate.split("Z")[0]) || ""}
            onChange={this.handleChange}
            className="input input-bordered"
          />
        </div>

        <div>
          <div>For</div>
          <Select
            isSearchable={false}
            name="faculty"
            value={{
              label: this.state.event.faculty ? "Faculty" : "Student",
              value: this.state.event.faculty || false,
            }}
            placeholder="For"
            options={[
              { label: 'Students', value: false },
              { label: 'Faculty', value: true },
            ]}
            onChange={(e) => this.setState({ event: { ...this.state.event, faculty: e.value } })}
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
          <label htmlFor="registrationStartDate">Registration Start Date: </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="registrationStartDate"
            id="registrationStartDate"
            value={(this.state.event.registrationStartDate && this.state.event.registrationStartDate.split("Z")[0]) || ""}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="registrationEndDate">Registration End Date: </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="registrationEndDate"
            id="registrationEndDate"
            value={(this.state.event.registrationEndDate && this.state.event.registrationEndDate.split("Z")[0]) || ""}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <Button
            onClick={this.handleClick}
            disabled={this.state.buttonText === this.UPDATING}
          >
            {this.state.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
