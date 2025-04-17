import React from "react";
import { Link } from "gatsby";
import collegesService from "../../services/colleges";
import eventsService from "../../services/events";
import teamsService from "../../services/teams";

export default class WinnerForm extends React.Component {
  state = {
    eventId: null,
    collegeId: null,
    event: null,
    college: null,
    participants: [],
    maxParticipants: 0,
    formSubmitted: false,
  };

  componentDidMount() {
    console.log(this.props);
    const { college, event } = this.props;
    this.setState({ eventId: event, collegeId: college }, this.init);
  }

  init = async () => {
    const { collegeId, eventId } = this.state;
    try {
      const college = await collegesService.get(collegeId);
      const event = await eventsService.get(eventId);
      const team = await teamsService.getTeamByCollegeAndEvent(collegeId, eventId);

      const maxParticipants = team?.members?.length || 1;
      const participants = Array.from({ length: maxParticipants }, () => this.emptyParticipant());

      this.setState({
        college,
        event,
        maxParticipants,
        participants,
      });
    } catch (err) {
      console.error("Error loading form data:", err);
    }
  };

  emptyParticipant = () => ({
    name: "",
    regNumber: "",
    panNumber: "",
    panPhoto: null,
    bankAccount: "",
    bankName: "",
    branch: "",
    ifsc: "",
    phone: "",
    chequeImage: null,
  });

  handleChange = (index, field, value) => {
    const participants = [...this.state.participants];
    participants[index][field] = value;
    this.setState({ participants });
  };

  handleFileChange = (index, field, file) => {
    const participants = [...this.state.participants];
    participants[index][field] = file;
    this.setState({ participants });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", this.state.participants);
    let payload = {
      eventId: this.state.eventId,
      collegeId: this.state.collegeId,
      participants:this.state.participants
    }
    console.log(payload);
    try{
      // let response = await teamsService.submitWinnerForm( payload );
      this.setState({ formSubmitted: true });
    }catch( err ){
      console.log(err);
    }
  };

  render() {
    const { college, event, participants, maxParticipants, formSubmitted } = this.state;

    if (!college || !event) {
      return <div>Loading form data...</div>;
    }

    if (formSubmitted) {
      return (
        <div>
          <div>Form submitted successfully!</div>
          <Link to="/teams/rankings">
            <button className="btn btn-primary mt-3">Go to Rankings</button>
          </Link>
        </div>
      );
    }
    

    return (
      <div className="container">
        <h2>Winners Form</h2>
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Winning College:</strong> {college.name}</p>

        <form onSubmit={this.handleSubmit}>
          {Array.from({ length: maxParticipants }).map((_, index) => {
            const participant = participants[index];

            return (
              <div key={index} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
                <h4>Participant {index + 1}</h4>
                <div><input type="text" placeholder="Name" required value={participant.name} onChange={e => this.handleChange(index, "name", e.target.value)} /></div>
                <div><input type="text" placeholder="Registration Number" required value={participant.regNumber} onChange={e => this.handleChange(index, "regNumber", e.target.value)} /></div>
                <div><input type="text" placeholder="PAN Number" required value={participant.panNumber} onChange={e => this.handleChange(index, "panNumber", e.target.value)} /></div>
                <div><input type="file" required onChange={e => this.handleFileChange(index, "panPhoto", e.target.files[0])} /></div>
                <div><input type="text" placeholder="Bank Account Number" required value={participant.bankAccount} onChange={e => this.handleChange(index, "bankAccount", e.target.value)} /></div>
                <div><input type="text" placeholder="Bank Name" required value={participant.bankName} onChange={e => this.handleChange(index, "bankName", e.target.value)} /></div>
                <div><input type="text" placeholder="Branch and Address" required value={participant.branch} onChange={e => this.handleChange(index, "branch", e.target.value)} /></div>
                <div><input type="text" placeholder="IFSC Code" required value={participant.ifsc} onChange={e => this.handleChange(index, "ifsc", e.target.value)} /></div>
                <div><input type="text" placeholder="Phone Number" required value={participant.phone} onChange={e => this.handleChange(index, "phone", e.target.value)} /></div>
                <div><input type="file" required onChange={e => this.handleFileChange(index, "chequeImage", e.target.files[0])} /></div>
              </div>
            );
          })}

          <div className="mt-3">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
