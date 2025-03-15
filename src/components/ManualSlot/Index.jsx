import React, { Component } from "react";
import { getColleges } from "../../services/collegeServices";
import useSlottingStore from "../../store/slotting.store";
import { Button } from "../../commons/Form";
import Select from "react-select";

class Index extends Component {
  constructor(props) {
    super(props);
    // Initialize local state; also get initial values from the store
    this.state = {
      colleges: [],
      selectedCollege: { id: "", name: "" },
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
  }

  componentWillUnmount() {
    // Unsubscribe from store updates when component unmounts
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Handle selection changes from react-select
  handleCollegeChange = (selectedOption) => {
    if (selectedOption) {
      this.setState(
        { selectedCollege: { id: selectedOption.value, name: selectedOption.label } },
        () => {
          // After setting the selected college, fetch its registered events
          useSlottingStore.getState().fetchRegisteredEvents({ collegeName: selectedOption.label });
        }
      );
    } else {
      this.setState({ selectedCollege: { id: "", name: "" } });
    }
  };

  // Handle the Generate Slots button click
  handleSlotCollege = () => {
    const { selectedCollege, eventDetails } = this.state;
    if (!selectedCollege.id) {
      console.error("No college selected");
      return;
    }
    useSlottingStore.getState().slotCollegeById({
      collegeId: selectedCollege.id,
      eventDetails: eventDetails,
    });
  };

  render() {
    const { colleges, selectedCollege, eventDetails, isLoading, error } = this.state;
    // Map colleges to options for react-select
    const options = colleges.map((college) => ({
      value: college.id,
      label: college.name,
    }));

    return (
      <div className="w-auto h-auto p-4">
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="college-select" className=" w-[400px] bg-zinc-50  rounded-md ">
            Select a College
          </label>
          <Select
            id="college-select"
            options={options}
            onChange={this.handleCollegeChange}
            value={
              selectedCollege.id
                ? { value: selectedCollege.id, label: selectedCollege.name }
                : null
            }
            placeholder="Choose a college"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Registered Events</h3>
          {isLoading && <p>Loading events...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {eventDetails && eventDetails.length > 0 ? (
            <ul className="list-disc ml-5">
              {eventDetails.map((event) => (
                <li key={event.id}>{event.name}</li>
              ))}
            </ul>
          ) : (
            !isLoading && <p>No events found.</p>
          )}
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={this.handleSlotCollege}
            disabled={!selectedCollege.id || isLoading}
            className="mucapp bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Slots
          </Button>
        </div>
      </div>
    );
  }
}

export default Index;
