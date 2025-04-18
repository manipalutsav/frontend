import React from "react";
import { Link } from "gatsby";
import collegesService from "../../services/colleges";
import eventsService from "../../services/events";
import teamsService from "../../services/teams";

const VALIDATIONS = {
  PHONE: /^[6-9]\d{9}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  ACCOUNT_NUMBER: /^\d{9,18}$/,
  FILE_MAX_SIZE: 2 * 1024 * 1024 // 2MB
};

export default class WinnerForm extends React.Component {
  state = {
    eventId: null,
    collegeId: null,
    event: null,
    college: null,
    participants: [],
    maxParticipants: 0,
    formSubmitted: false,
    isSubmitting: false,
    submitError: null,
    fieldErrors: {}
  };

  componentDidMount() {
    const eventId = this.props.event;
    const collegeId = this.props.college;
    if (eventId && collegeId) {
      this.setState({ eventId, collegeId }, this.init);
    } else {
      console.error("Missing eventId or collegeId in props");
    }
  }

  init = async () => {
    const { collegeId, eventId } = this.state;
    try {
      const college = await collegesService.get(collegeId);
      const event = await eventsService.get(eventId);
      const team = await teamsService.getTeamByCollegeAndEvent(collegeId, eventId);
      const maxParticipants = team?.members?.length || 1;
      const participants = Array.from({ length: maxParticipants }, () => this.emptyParticipant());
      this.setState({ college, event, maxParticipants, participants });
    } catch (err) {
      console.error("Error loading form data:", err);
      this.setState({ submitError: "Failed to load initial form data." });
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

  validateField = (field, value) => {
    switch (field) {
      case "phone":
        if (!VALIDATIONS.PHONE.test(value)) return "Invalid phone number (must be 10 digits, start with 6-9).";
        break;
      case "ifsc":
        if (!VALIDATIONS.IFSC.test(value.toUpperCase())) return "Invalid IFSC code (e.g., SBIN0001234).";
        break;
      case "panNumber":
        if (!VALIDATIONS.PAN.test(value.toUpperCase())) return "Invalid PAN (e.g., ABCDE1234F).";
        break;
      case "bankAccount":
        if (!VALIDATIONS.ACCOUNT_NUMBER.test(value)) return "Invalid account number (9–18 digits).";
        break;
      default:
        break;
    }
    return null;
  };

  handleChange = (index, field, value) => {
    const participants = [...this.state.participants];
    const fieldErrors = { ...this.state.fieldErrors };
    const error = this.validateField(field, value);

    if (!fieldErrors[index]) fieldErrors[index] = {};
    fieldErrors[index][field] = error;

    participants[index][field] = value;
    this.setState({ participants, fieldErrors });
  };

  handleFileChange = (index, field, file, event) => {
    const participants = [...this.state.participants];
    const fieldErrors = { ...this.state.fieldErrors };

    if (!fieldErrors[index]) fieldErrors[index] = {};

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        fieldErrors[index][field] = "Invalid file type. Use JPG, PNG, or PDF.";
        if (event) event.target.value = "";
        this.setState({ fieldErrors });
        return;
      }
      if (file.size > VALIDATIONS.FILE_MAX_SIZE) {
        fieldErrors[index][field] = "File too large. Max size is 2MB.";
        if (event) event.target.value = "";
        this.setState({ fieldErrors });
        return;
      }
      fieldErrors[index][field] = null;
    }

    participants[index][field] = file;
    this.setState({ participants, fieldErrors });
  };

  validateAll = () => {
    const { participants } = this.state;
    let isValid = true;
    const fieldErrors = {};

    participants.forEach((p, idx) => {
      fieldErrors[idx] = {};
      // Required checks
      Object.entries(p).forEach(([key, value]) => {
        if (
          !value &&
          key !== "panPhoto" &&
          key !== "chequeImage"
        ) {
          fieldErrors[idx][key] = "This field is required.";
          isValid = false;
        }
      });

      // Format checks
      ["phone", "ifsc", "panNumber", "bankAccount"].forEach((key) => {
        const error = this.validateField(key, p[key]);
        if (error) {
          fieldErrors[idx][key] = error;
          isValid = false;
        }
      });

      // File checks
      if (!(p.panPhoto instanceof File)) {
        fieldErrors[idx]["panPhoto"] = "PAN Photo is required.";
        isValid = false;
      }
      if (!(p.chequeImage instanceof File)) {
        fieldErrors[idx]["chequeImage"] = "Cheque Image is required.";
        isValid = false;
      }
    });

    this.setState({ fieldErrors });
    return isValid;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isSubmitting: true, submitError: null });

    if (!this.validateAll()) {
      this.setState({ isSubmitting: false, submitError: "Please fix the errors above." });
      return;
    }

    const { eventId, collegeId, participants } = this.state;
    const formData = new FormData();
    formData.append('collegeId', collegeId);
    formData.append('eventId', eventId);

    const participantsForJson = participants.map((p) => {
      const { panPhoto, chequeImage, ...textData } = p;
      return textData;
    });
    formData.append('participants', JSON.stringify(participantsForJson));

    participants.forEach((p, index) => {
      formData.append(`panPhoto-${index}`, p.panPhoto, p.panPhoto.name);
      formData.append(`chequePhoto-${index}`, p.chequeImage, p.chequeImage.name);
    });

    try {
      await teamsService.submitWinnerForm(formData);
      this.setState({ formSubmitted: true, isSubmitting: false });
    } catch (err) {
      console.error("Submission Error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred during submission.";
      this.setState({ submitError: errorMessage, isSubmitting: false });
    }
  };

  render() {
    const { college, event, participants, formSubmitted, isSubmitting, submitError, fieldErrors } = this.state;
    if (!college || !event) {
      return <div className="text-center py-10 text-lg">Loading...</div>;
    }
    if (formSubmitted) {
      return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#ff5800]">
            Submission Successful!
          </h2>
          <p className="text-lg text-gray-600">
            Thank you for submitting the winner details.
          </p>
          <Link to={`/teams/rankings`}>
            <button className="btn btn-primary">Go back to rankings</button>
          </Link>
        </div>
      );
    }

    return (
      <form
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8"
        onSubmit={this.handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ff5800]">
          Winner Submission Form
        </h2>

        {/* Event and College Info */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0 flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Event
                <span className="text-[#ff5800] ml-1">*</span>
              </label>
              <input
                type="text"
                value={event?.name || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Winning College
                <span className="text-[#ff5800] ml-1">*</span>
              </label>
              <input
                type="text"
                value={college?.name || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-8">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4 text-[#ff5800]">
                Participant {idx + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Name
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.name ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.name}
                    onChange={e => this.handleChange(idx, "name", e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                  {fieldErrors[idx]?.name && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].name}</p>
                  )}
                </div>
                {/* Registration Number */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Registration Number
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.regNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.regNumber}
                    onChange={e => this.handleChange(idx, "regNumber", e.target.value)}
                    placeholder="Reg Number"
                    required
                  />
                  {fieldErrors[idx]?.regNumber && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].regNumber}</p>
                  )}
                </div>
                {/* PAN Number */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    PAN Number
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] uppercase ${
                      fieldErrors[idx]?.panNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.panNumber}
                    onChange={e => this.handleChange(idx, "panNumber", e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    required
                  />
                  {fieldErrors[idx]?.panNumber && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].panNumber}</p>
                  )}
                </div>
                {/* Bank Account */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Bank Account
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.bankAccount ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.bankAccount}
                    onChange={e => this.handleChange(idx, "bankAccount", e.target.value)}
                    placeholder="Account Number"
                    required
                  />
                  {fieldErrors[idx]?.bankAccount && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].bankAccount}</p>
                  )}
                </div>
                {/* Bank Name */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Bank Name
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.bankName ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.bankName}
                    onChange={e => this.handleChange(idx, "bankName", e.target.value)}
                    placeholder="Bank Name"
                    required
                  />
                  {fieldErrors[idx]?.bankName && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].bankName}</p>
                  )}
                </div>
                {/* Branch */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Branch
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.branch ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.branch}
                    onChange={e => this.handleChange(idx, "branch", e.target.value)}
                    placeholder="Branch"
                    required
                  />
                  {fieldErrors[idx]?.branch && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].branch}</p>
                  )}
                </div>
                {/* IFSC */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    IFSC
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] uppercase ${
                      fieldErrors[idx]?.ifsc ? "border-red-500" : "border-gray-300"
                    }`}
                    type="text"
                    value={p.ifsc}
                    onChange={e => this.handleChange(idx, "ifsc", e.target.value.toUpperCase())}
                    placeholder="SBIN0001234"
                    required
                  />
                  {fieldErrors[idx]?.ifsc && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].ifsc}</p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Phone
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 focus:ring-[#ff5800] focus:border-[#ff5800] ${
                      fieldErrors[idx]?.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    type="tel"
                    value={p.phone}
                    onChange={e => this.handleChange(idx, "phone", e.target.value)}
                    placeholder="Phone Number"
                    required
                  />
                  {fieldErrors[idx]?.phone && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].phone}</p>
                  )}
                </div>
                {/* PAN Photo */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    PAN Photo
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#ff5800]/10 file:text-[#ff5800] hover:file:bg-[#ff5800]/20 ${
                      fieldErrors[idx]?.panPhoto ? "border-red-500" : "border-gray-300"
                    }`}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={e => this.handleFileChange(idx, "panPhoto", e.target.files[0], e)}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Allowed: JPG, PNG, PDF. <span className="text-[#ff5800] font-semibold">Max size: 2MB</span>
                  </p>
                  {fieldErrors[idx]?.panPhoto && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].panPhoto}</p>
                  )}
                </div>
                {/* Cheque Image */}
                <div>
                  <label className="block text-gray-600 mb-1">
                    Cheque Image
                    <span className="text-[#ff5800] ml-1">*</span>
                  </label>
                  <input
                    className={`w-full border rounded-lg p-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#ff5800]/10 file:text-[#ff5800] hover:file:bg-[#ff5800]/20 ${
                      fieldErrors[idx]?.chequeImage ? "border-red-500" : "border-gray-300"
                    }`}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={e => this.handleFileChange(idx, "chequeImage", e.target.files[0], e)}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Allowed: JPG, PNG, PDF. <span className="text-[#ff5800] font-semibold">Max size: 2MB</span>
                  </p>
                  {fieldErrors[idx]?.chequeImage && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors[idx].chequeImage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {submitError && (
          <div className="mt-6 text-red-600 text-center font-semibold">
            {submitError}
          </div>
        )}
        <button
          type="submit"
          className="mt-8 w-full bg-[#ff5800] hover:bg-[#ff5800]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    );
  }
}
