import React, { Component } from "react";
import { getColleges } from "../../services/collegeServices";
import { get } from "../../services/eventService"; // Assuming this is the imported controller
import useSlottingStore from "../../store/slotting.store";
import { Button } from "../../commons/Form";
import Select from "react-select";

class Index extends Component {
  constructor(props) {
    super(props);
    // Initialize local state; also get initial values from the store
    this.state = {
      colleges: [],
      events: [],
      selectedCollege: { id: "", name: "" },
      numberOfEvents: "",
      selectedEvents: [],
      availableEvents: [],
      eventDetails: useSlottingStore.getState().eventDetails,
      isLoading: useSlottingStore.getState().isLoading,
      error: useSlottingStore.getState().error,
    };
  }

  componentDidMount() {
    // Subscribe to store updates so local state stays in sync
    this.unsubscribe = useSlottingStore.subscribe((storeState) => {
      this.setState({
        eventDetails: storeState.eventDetails,
        isLoading: storeState.isLoading,
        error: storeState.error,
      });
    });

    // Fetch the list of colleges on mount
    getColleges().then((res) => {
      if (res && res.status === 200) {
        this.setState({ colleges: res.data });
      } else {
        console.error("Failed to fetch colleges");
      }
    });

    // Fetch all events
    get().then((res) => {
      if (res && res.status === 200) {
        this.setState({ 
          events: res.data,
          availableEvents: res.data 
        });
      } else {
        console.error("Failed to fetch events");
      }
    });
  }

  componentWillUnmount() {
    // Unsubscribe from store updates when component unmounts
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Handle selection changes from react-select for college
  handleCollegeChange = (selectedOption) => {
    if (selectedOption) {
      this.setState(
        {
          selectedCollege: {
            id: selectedOption.value,
            name: selectedOption.label
          },
          selectedEvents: [],
          numberOfEvents: ""
        },
        () => {
          // After setting the selected college, fetch its registered events
          useSlottingStore.getState().fetchRegisteredEvents({
            collegeName: selectedOption.label
          });
        }
      );
    } else {
      this.setState({
        selectedCollege: { id: "", name: "" },
        selectedEvents: [],
        numberOfEvents: ""
      });
    }
  };

  // Handle number of events input change
  handleNumberOfEventsChange = (e) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      this.setState({
        numberOfEvents: value,
        selectedEvents: value ? Array(parseInt(value)).fill(null) : []
      });
    }
  };

  // Handle event selection
  handleEventChange = (selectedOption, index) => {
    const { selectedEvents, events } = this.state;
    const newSelectedEvents = [...selectedEvents];
    
    if (selectedOption) {
      newSelectedEvents[index] = {
        id: selectedOption.value,
        name: selectedOption.label
      };
    } else {
      newSelectedEvents[index] = null;
    }
    
    this.setState({ selectedEvents: newSelectedEvents });
    
    // Update available events for other select boxes
    this.updateAvailableEvents(newSelectedEvents);
  };

  // Update available events based on current selections
  updateAvailableEvents = (selectedEvents) => {
    const { events } = this.state;
    
    // Filter out already selected events
    const selectedEventIds = selectedEvents
      .filter(event => event !== null)
      .map(event => event.id);
    
    const availableEvents = events.filter(event => 
      !selectedEventIds.includes(event.id)
    );
    
    this.setState({ availableEvents });
  };

  // Handle the Generate Slots button click
  handleSlotCollege = () => {
    const { selectedCollege, selectedEvents } = this.state;
    
    // Validate college selection
    if (!selectedCollege.id) {
      console.error("No college selected");
      return;
    }
    
    // Validate event selections
    if (selectedEvents.some(event => event === null)) {
      console.error("Please select all events");
      return;
    }
    
    // Call the slotting function with college ID and selected events
    useSlottingStore.getState().slotCollegeById({
      collegeId: selectedCollege.id,
      eventDetails: selectedEvents,
    });
  };

  render() {
    const {
      colleges,
      events,
      availableEvents,
      selectedCollege,
      numberOfEvents,
      selectedEvents,
      eventDetails,
      isLoading,
      error
    } = this.state;

    // Map colleges to options for react-select
    const collegeOptions = colleges.map((college) => ({
      value: college.id,
      label: college.name,
    }));

    // Create event options for each select box
    const getEventOptions = (index) => {
      // For each select box, exclude events that are already selected in other boxes
      const otherSelectedEventIds = selectedEvents
        .filter((event, i) => i !== index && event !== null)
        .map(event => event.id);
      
      return events
        .filter(event => !otherSelectedEventIds.includes(event.id))
        .map(event => ({
          value: event.id,
          label: event.name
        }));
    };

    return (
      <div className="container mt-4">
        <div className="form-group mb-4 pl-4">
          <label>Select College:</label>
          <Select
            value={selectedCollege.id ? { value: selectedCollege.id, label: selectedCollege.name } : null}
            onChange={this.handleCollegeChange}
            options={collegeOptions}
            placeholder="Select a college..."
            isClearable
          />
        </div>
        
        <div className="form-group mb-4 pl-4">
          <label className="form-label text-md">Number of Events for Slotting:</label>
          <input
            type="text"
            className="form-control border rounded-sm h-10 py-2  px-1 w-full text-base"
            value={numberOfEvents}
            onChange={this.handleNumberOfEventsChange}
            placeholder="Enter number of events"
          />
        </div>
        
        {numberOfEvents && parseInt(numberOfEvents) > 0 && (
          <div className="event-selections mb-4 pl-4">
            <h4>Select Events</h4>
            {Array.from({ length: parseInt(numberOfEvents) }).map((_, index) => (
              <div className="form-group mb-3" key={index}>
                <label>Event {index + 1}:</label>
                <Select
                  value={
                    selectedEvents[index]
                      ? { value: selectedEvents[index].id, label: selectedEvents[index].name }
                      : null
                  }
                  onChange={(option) => this.handleEventChange(option, index)}
                  options={getEventOptions(index)}
                  placeholder={`Select event ${index + 1}...`}
                  isClearable
                />
              </div>
            ))}
          </div>
        )}
        
        <Button
          onClick={this.handleSlotCollege}
          disabled={
            !selectedCollege.id ||
            !numberOfEvents ||
            selectedEvents.length !== parseInt(numberOfEvents) ||
            selectedEvents.some(event => event === null) ||
            isLoading
          }
          className="btn btn-primary"
        >
          {isLoading ? "Generating Slots..." : "Generate Slots"}
        </Button>
        
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        
        {/* <div className="mt-4">
          {isLoading ? (
            <p>Loading events...</p>
          ) : eventDetails && eventDetails.length > 0 ? (
            <div>
              <h4>Selected Events:</h4>
              <ul className="list-group">
                {eventDetails.map((event, index) => (
                  <li key={index} className="list-group-item">
                    {event.name} (ID: {event.id})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No events found.</p>
          )}
        </div> */}
      </div>
    );
  }
}

export default Index;
