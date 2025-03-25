import React, { Component } from "react";
import { getColleges } from "../../services/collegeServices";
import useSlottingStore from "../../store/slotting.store";
import { Button } from "../../commons/Form";
import Select from "react-select";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colleges: [],
      selectedCollege: { id: "", name: "" },
      // selectedEvents will now simply mirror the event details returned from the store
      selectedEvents: [],
      eventDetails: useSlottingStore.getState().eventDetails,
      isLoading: useSlottingStore.getState().isLoading,
      error: useSlottingStore.getState().error,
    };
  }

  componentDidMount() {
    // Subscribe to store updates
    this.unsubscribe = useSlottingStore.subscribe((storeState) => {
      this.setState({
        eventDetails: storeState.eventDetails,
        isLoading: storeState.isLoading,
        error: storeState.error,
        // Pre-populate selectedEvents with the event details from the API.
        selectedEvents: storeState.eventDetails.length > 0
          ? storeState.eventDetails.map((event) => ({
            id: event.id,
            name: event.name,
          }))
          : [],
      });
    });


    // Fetch colleges only
    getColleges().then((res) => {
      if (res && res.status === 200) {
        this.setState({ colleges: res.data });
      } else {
        console.error("Failed to fetch colleges");
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleCollegeChange = (selectedOption) => {
    if (selectedOption) {
      this.setState(
        {
          selectedCollege: {
            id: selectedOption.value,
            name: selectedOption.label,
          },
          selectedEvents: [], // reset previous selections
        },
        () => {
          // Fetch events registered for this college
          useSlottingStore.getState().fetchRegisteredEvents({
            collegeName: selectedOption.label,
          });
        }
      );
    } else {
      this.setState({
        selectedCollege: { id: "", name: "" },
        selectedEvents: [],
      });
    }
  };

  handleSlotCollege = () => {
    const { selectedCollege, selectedEvents } = this.state;

    if (!selectedCollege.id) {
      console.error("No college selected");
      return;
    }

    if (selectedEvents.length === 0) {
      console.error("No events available to slot");
      return;
    }

    useSlottingStore.getState().slotCollegeById({
      collegeId: selectedCollege.id,
      eventDetails: selectedEvents,
    });
  };

  render() {
    const {
      colleges,
      selectedCollege,
      eventDetails,
      isLoading,
      error,
    } = this.state;

    const collegeOptions = colleges.map((college) => ({
      value: college.id,
      label: college.name,
    }));

    return (
      <div className="container mt-4">
        <div className="form-group mb-4 pl-4">
          <label>Select College:</label>
          <Select
            value={
              selectedCollege.id
                ? { value: selectedCollege.id, label: selectedCollege.name }
                : null
            }
            onChange={this.handleCollegeChange}
            options={collegeOptions}
            placeholder="Select a college..."
            isClearable
          />
        </div>
        <div className="form-group  pl-4">
          {selectedCollege.id && (
            isLoading ? (
              <p>Loading events...</p>
            ) : eventDetails.length > 0 ? (
              <div className="event-selections mb-4 pl-1">
                <h4>Events to Slot:</h4>
                <ul>
                  {eventDetails.map((event, index) => (
                    <li key={index}>
                      {event.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No events with unslotted teams found for this college.</p>
            )
          )}

          <Button
            onClick={this.handleSlotCollege}
            disabled={
              !selectedCollege.id ||
              eventDetails.length === 0 ||
              isLoading
            }
            className="btn btn-primary mt-3"
          >
            {isLoading ? "Generating Slots..." : "Generate Slots"}
          </Button>

          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    );
  }
}

export default Index;
