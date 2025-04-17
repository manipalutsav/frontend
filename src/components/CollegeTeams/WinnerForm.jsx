import React from "react";
import { Link } from "gatsby"; // Assuming Gatsby context, adjust if needed
import collegesService from "../../services/colleges";
import eventsService from "../../services/events";
import teamsService from "../../services/teams";

// Assuming teamsService.submitWinnerForm can handle FormData
// Example using axios might look like:
// submitWinnerForm: (formData) => axios.post('/api/teams/submitWinnerForm', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
// Note: Often axios/fetch set the Content-Type automatically for FormData

export default class WinnerForm extends React.Component {
  state = {
    eventId: null,
    collegeId: null,
    event: null,
    college: null,
    participants: [],
    maxParticipants: 0,
    formSubmitted: false,
    isSubmitting: false, // Added state to disable button during submission
    submitError: null, // Added state to display submission errors
  };

  componentDidMount() {
    // Get props from router or parent component
    // Ensure props.event and props.college contain the IDs
    const eventId = this.props.event; // Adjust based on how props are passed
    const collegeId = this.props.college; // Adjust based on how props are passed

    if (eventId && collegeId) {
      this.setState({ eventId, collegeId }, this.init);
    } else {
      console.error("Missing eventId or collegeId in props");
      // Handle error state - maybe redirect or show message
    }
  }

  init = async () => {
    const { collegeId, eventId } = this.state;
    try {
      const college = await collegesService.get(collegeId);
      const event = await eventsService.get(eventId);
      // Fetch team details to determine max participants if needed
      // This logic might vary based on your application rules
      const team = await teamsService.getTeamByCollegeAndEvent(collegeId, eventId);

      // Determine max participants - using team members length or fallback to 1
      // Adjust this logic if winners count is determined differently
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
      // Set an error state to inform the user
      this.setState({ submitError: "Failed to load initial form data." });
    }
  };

  // Helper to create an empty participant structure
  emptyParticipant = () => ({
    name: "",
    regNumber: "",
    panNumber: "",
    panPhoto: null, // Will hold the File object
    bankAccount: "",
    bankName: "",
    branch: "",
    ifsc: "",
    phone: "",
    chequeImage: null, // Will hold the File object
  });

  // Handles changes for text input fields
  handleChange = (index, field, value) => {
    const participants = [...this.state.participants];
    participants[index][field] = value;
    this.setState({ participants });
  };

  // Handles file selection
  handleFileChange = (index, field, file) => {
    // Basic file validation (optional but recommended)
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            alert(`Invalid file type for ${field}. Please select a JPEG, PNG, or PDF.`);
            return; // Stop processing this file
        }
        if (file.size > maxSize) {
             alert(`File size for ${field} exceeds the 2MB limit.`);
             return; // Stop processing this file
        }
    }

    const participants = [...this.state.participants];
    participants[index][field] = file; // Store the File object
    this.setState({ participants });
  };

  // --- *** MODIFIED handleSubmit *** ---
  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, submitError: null }); // Disable button, clear old errors

    const { eventId, collegeId, participants } = this.state;

    // 1. Create FormData object
    const formData = new FormData();

    // 2. Append standard fields
    formData.append('collegeId', collegeId);
    formData.append('eventId', eventId);

    // 3. Prepare participant data WITHOUT files for JSON string
    const participantsForJson = participants.map(p => {
      // Destructure to exclude file keys
      const { panPhoto, chequeImage, ...textData } = p;
      // Basic validation: Check if all required text fields are filled (optional here, could be done earlier)
      for(const key in textData) {
          if(!textData[key] && key !== 'panPhoto' && key !== 'chequeImage') { // Check if any required text field is empty
             // Optionally throw error or mark form invalid
             console.warn(`Participant ${participants.indexOf(p) + 1} has empty field: ${key}`);
             // Consider adding validation feedback to the UI
          }
      }
      return textData; // Return object with only non-file data
    });

    // 4. Stringify and append the non-file participant data
    formData.append('participants', JSON.stringify(participantsForJson));

    // 5. Append files with indexed field names
    let filesValid = true;
    participants.forEach((p, index) => {
      // Check if file exists before appending
      if (p.panPhoto instanceof File) {
        formData.append(`panPhoto-${index}`, p.panPhoto, p.panPhoto.name);
      } else {
        // Handle missing required file
        this.setState({ submitError: `Missing PAN Photo for participant ${index + 1}.`, isSubmitting: false });
        filesValid = false;
        console.error(`Missing PAN Photo file object for participant ${index}`);
        return; // Exit forEach early if needed, or just flag
      }

      if (p.chequeImage instanceof File) {
        formData.append(`chequePhoto-${index}`, p.chequeImage, p.chequeImage.name);
      } else {
         // Handle missing required file
         this.setState({ submitError: `Missing Cheque Image for participant ${index + 1}.`, isSubmitting: false });
         filesValid = false;
         console.error(`Missing Cheque Image file object for participant ${index}`);
         return; // Exit forEach early if needed, or just flag
      }
    });

    // Stop submission if required files are missing
    if (!filesValid) {
        return;
    }


    // --- Debugging: Log FormData entries (won't show file content, but keys are useful) ---
    console.log("Submitting FormData:");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    // --- End Debugging ---


    // 6. Send the FormData object using the service
    try {
      // Ensure teamsService.submitWinnerForm can handle FormData
      let response = await teamsService.submitWinnerForm(formData);
      console.log("Submission Response:", response); // Log success response
      this.setState({ formSubmitted: true, isSubmitting: false });
    } catch (err) {
      console.error("Submission Error:", err);
      // Try to get specific error message from response if available
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred during submission.";
      this.setState({ submitError: errorMessage, isSubmitting: false }); // Show error to user, re-enable button
    }
  };

  render() {
    const { college, event, participants, maxParticipants, formSubmitted, isSubmitting, submitError } = this.state;

    if (!college || !event) {
      return <div>Loading form data...</div>;
    }

    // Display success message
    if (formSubmitted) {
      return (
        <div className="container mt-4">
          <div className="alert alert-success" role="alert">
            Form submitted successfully!
          </div>
          <Link to="/teams/rankings"> {/* Adjust link as needed */}
            <button className="btn btn-primary mt-3">Go to Rankings</button>
          </Link>
        </div>
      );
    }

    // Main form rendering
    return (
      <div className="container mt-4">
        <h2>Winners Form</h2>
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Winning College:</strong> {college.name}</p>

        {/* Display submission errors */}
        {submitError && (
            <div className="alert alert-danger" role="alert">
                Submission Failed: {submitError}
            </div>
        )}

        {/* Use standard form tag, but submission is handled by JS */}
        <form onSubmit={this.handleSubmit}>
          {/* Map through participants based on maxParticipants */}
          {Array.from({ length: maxParticipants }).map((_, index) => {
            // Get participant data, provide default empty object if needed
            const participant = participants[index] || this.emptyParticipant();

            return (
              // Use Bootstrap card styling for better separation
              <div key={index} className="card mb-3">
                 <div className="card-header">
                    <h4>Participant {index + 1}</h4>
                 </div>
                 <div className="card-body">
                    {/* Use form-group for better spacing */}
                    <div className="form-group mb-2">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            required
                            value={participant.name}
                            onChange={e => this.handleChange(index, "name", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                         <label>Registration Number</label>
                         <input
                            type="text"
                            className="form-control"
                            placeholder="Registration Number"
                            required
                            value={participant.regNumber}
                            onChange={e => this.handleChange(index, "regNumber", e.target.value)} />
                    </div>
                     <div className="form-group mb-2">
                         <label>PAN Number</label>
                         <input
                            type="text"
                            className="form-control"
                            placeholder="PAN Number (e.g., ABCDE1234F)"
                            required
                            pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" // Add pattern validation
                            title="PAN should be 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)"
                            value={participant.panNumber}
                            onChange={e => this.handleChange(index, "panNumber", e.target.value.toUpperCase())} // Convert to uppercase
                         />
                    </div>
                     <div className="form-group mb-2">
                         <label>PAN Photo (JPG, PNG, PDF - Max 2MB)</label>
                         <input
                            type="file"
                            className="form-control"
                            required
                            accept="image/jpeg,image/png,application/pdf" // Specify accepted types
                            onChange={e => this.handleFileChange(index, "panPhoto", e.target.files[0])}
                         />
                         {/* Optional: Display selected filename */}
                         {participant.panPhoto && <small className="form-text text-muted">Selected: {participant.panPhoto.name}</small>}
                    </div>
                     <div className="form-group mb-2">
                         <label>Bank Account Number</label>
                         <input
                            type="text"
                             className="form-control"
                            placeholder="Bank Account Number"
                            required
                            value={participant.bankAccount}
                            onChange={e => this.handleChange(index, "bankAccount", e.target.value)} />
                    </div>
                     <div className="form-group mb-2">
                         <label>Bank Name</label>
                         <input
                            type="text"
                             className="form-control"
                            placeholder="Bank Name"
                            required
                            value={participant.bankName}
                            onChange={e => this.handleChange(index, "bankName", e.target.value)} />
                    </div>
                     <div className="form-group mb-2">
                         <label>Branch and Address</label>
                         <input
                            type="text"
                             className="form-control"
                            placeholder="Branch and Address"
                            required
                            value={participant.branch}
                            onChange={e => this.handleChange(index, "branch", e.target.value)} />
                    </div>
                     <div className="form-group mb-2">
                         <label>IFSC Code</label>
                         <input
                            type="text"
                             className="form-control"
                            placeholder="IFSC Code"
                            required
                            value={participant.ifsc}
                            onChange={e => this.handleChange(index, "ifsc", e.target.value.toUpperCase())} />
                    </div>
                     <div className="form-group mb-2">
                         <label>Phone Number</label>
                         <input
                            type="tel" // Use tel type for phone numbers
                             className="form-control"
                            placeholder="10-digit Phone Number"
                            required
                            pattern="[0-9]{10}" // Basic 10-digit validation
                            title="Please enter a 10-digit phone number"
                            value={participant.phone}
                            onChange={e => this.handleChange(index, "phone", e.target.value)} />
                    </div>
                     <div className="form-group mb-3"> {/* Added mb-3 for spacing before button */}
                         <label>Cancelled Cheque Photo (JPG, PNG, PDF - Max 2MB)</label>
                         <input
                            type="file"
                             className="form-control"
                            required
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={e => this.handleFileChange(index, "chequeImage", e.target.files[0])}
                         />
                          {/* Optional: Display selected filename */}
                         {participant.chequeImage && <small className="form-text text-muted">Selected: {participant.chequeImage.name}</small>}
                    </div>
                 </div> {/* End card-body */}
              </div> // End card
            );
          })}

          <div className="mt-3">
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
