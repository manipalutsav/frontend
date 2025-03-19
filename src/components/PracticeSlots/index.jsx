import React from 'react';
import Scramble from 'react-scramble';
import Dialog from '../../commons/Dialog';
import practiceSlotsService from '../../services/practiceSlots';
import LBList from '../../commons/LBList';
import Shuffle from '../../commons/Shuffle';
import { getTeamName } from '../../utils/common';
import { toast } from '../../actions/toastActions';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.slots = [];
    this.timer = null;

    this.animate = this.animate.bind(this);
    this.startSlotting = this.startSlotting.bind(this);
    this.deleteSlots = this.deleteSlots.bind(this);

    this.state = {
      timeError: '',
      showSlottingForm: false,
      startTime: null,
      endTime: null,
      loaded: false,
      event: {},
      slots: [],
      teams: [],
      visibleSlots: [],
      showOnlyRegistered: true,
      newSlots: [],
      slotting: false,
      slotted: false,
      eventDate: '2025-03-24',
    };
  }

  componentWillMount() {
    console.log('check');

    practiceSlotsService.getPracticeSlotByDate(this.state.eventDate).then((slots) =>
        this.setState({ slots, loaded: true, slotted: slots?.length > 0 })
      );
    console.log(this.state.slots, 'sltos');
  }

  

  animate(slots) {
    this.slots = Object.assign([], slots);
    //this.slots = slots;

    this.timer = setInterval(() => {
      let slot = this.slots.shift();

      if (!slot) {
        return clearTimeout(this.timer);
      }

      let newSlots = this.state.newSlots;
      newSlots.push(slot);

      this.setState({ newSlots });
    }, 1000);
  }

  startSlotting() {
    this.setState({ slotting: true });
    practiceSlotsService
      .createPracticeSlot(
        this.state.eventDate,
        this.state.startTime,
        this.state.endTime
      )
      .then((slots) =>
        this.setState({ slots }, () => this.animate(this.state.slots))
      );
  }

  deleteSlots() {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Are you sure you want to reset slots?')
    ) {
      practiceSlotsService.deletePracticeSlot(this.state.eventDate).then(() => {
        this.slots = [];
        this.timer = null;

        this.setState({
          slots: [],
          newSlots: [],
          slotting: false,
          slotted: false,
        });
      });
    }
  }
  handleDateChange = (event) => {
    // Function to handle date selection from dropdown
    this.setState({ eventDate: event.target.value });
    this.setState({
      slots: [],
      newSlots: [],
      slotting: false,
      slotted: false,
    });
    
    practiceSlotsService.getPracticeSlotByDate(event.target.value).then((slots) =>
        this.setState({ slots, loaded: true, slotted: slots?.length > 0 })
      );
  };

  openSlottingForm = () => {
    this.setState({ timeError: '', showSlottingForm: true });
  };

  closeSlottingForm = () => {
    this.setState({ timeError: '', showSlottingForm: false });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  SubmitSlottingForm = () => {
    const { startTime, endTime } = this.state;

    if (!startTime || !endTime) {
      this.setState({
        timeError: 'Please fill in both Start Time and End Time.',
      });
      return;
    }

    if (startTime >= endTime) {
      this.setState({ timeError: 'End Time must be later than Start Time.' });
      return;
    }

    // Clear error if validation passes
    this.setState({ timeError: '', showSlottingForm: false });
    this.startSlotting();
    this.closeSlottingForm();

    console.log(this.state);
  };
  

  render = () =>
    this.state.loaded ? (
      this.state.slotted ? (
        <div>
          <div
            css={{
              textAlign: 'center',
              marginBottom: 30,
            }}
          >
            <h2 className="mucapp">Practice Slots</h2>
            <button className="mucapp" onClick={this.deleteSlots}>
              Reset Slots
            </button>
            <select
              name="date"
              id="date"
              style={{ cursor: 'pointer' }}
              value={this.state.eventDate}
              onChange={this.handleDateChange}
              className="m-2 py-2 px-4 border border-orange-500 rounded-md bg-slate-300 bg-opacity-100"
            >
              {/* Dropdown to select event date */}
              <option value="2025-03-24">March 24, 2025</option>
              <option value="2025-03-25">March 25, 2025</option>
              <option value="2025-03-26">March 26, 2025</option>
              <option value="2025-03-27">March 27, 2025</option>
              <option value="2025-03-28">March 28, 2025</option>
            </select>
          </div>
          <div>
            {this.state.slots.map((slot, i) => (
              <LBList
                key={i}
                color={'#444'} 
                position={slot.order}
                title={`${slot.college}, ${slot.location}`}
                // description={this.getTimeSlot(i)}
                description={ `${slot.startTime} - ${slot.endTime}`}
              />
            ))}
          </div>
        </div>
      ) : this.state.slotting ? (
        <div>
          <div
            css={{
              textAlign: 'center',
              marginBottom: 30,
            }}
          >
            <h2 className="mucapp">
              Practice slots
              {this.state.event?.rounds &&
                this.state.event.rounds?.length > 1 && (
                  <>
                    {' '}
                    Round{' '}
                    {this.state.event.rounds.indexOf(this.props.round) + 1}
                  </>
                )}
            </h2>
            {/* <button className="mucapp" onClick={this.deleteSlots}>Reset Slots</button> */}
            <select
              name="date"
              id="date"
              style={{ cursor: 'pointer' }}
              value={this.state.eventDate}
              onChange={this.handleDateChange}
              className=" py-2 px-4 border border-orange-500 rounded-md bg-slate-300 bg-opacity-100 m-2"
            >
              {/* Dropdown to select event date */}
              <option value="2025-03-24">March 24, 2025</option>
              <option value="2025-03-25">March 25, 2025</option>
              <option value="2025-03-26">March 26, 2025</option>
              <option value="2025-03-27">March 27, 2025</option>
              <option value="2025-03-28">March 28, 2025</option>
            </select>
          </div>

          <div>
            {this.state.newSlots.map((slot, i) => (
              <LBList
                key={i}
                position={slot.order}
                team={String.fromCharCode(65 + slot.team)}
                title={
                  <Scramble
                    autoStart
                    preScramble
                    speed="slow"
                    text={`${slot.college}, ${slot.location}`}
                    steps={[
                      {
                        action: '-',
                        type: 'random',
                      },
                    ]}
                  />
                }
                description={ `${slot.startTime} - ${slot.endTime}`}
              />
            ))}
          </div>
          <div>
            {this.state.slots?.length !== this.slots?.length &&
            this.slots?.length ? (
              <Shuffle />
            ) : null}
          </div>
        </div>
      ) : (
        <div
          css={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2 className="mucapp">{this.state.event.name}</h2>
          <div css={{ color: 'rgba(0, 0, 0, .5)' }}>
            Practice slots are not yet generated
          </div>
          <p css={{ color: 'green' }}>Generate slots now!</p>
          <button className="mucapp" onClick={this.openSlottingForm}>
            {this.state.slotting ? 'Slotting...' : 'Start Slotting'}
          </button>
          <select
            name="date"
            style={{ cursor: 'pointer' }}
            id="date"
            value={this.state.eventDate}
            onChange={this.handleDateChange}
            className=" py-2 px-4 border border-orange-500 rounded-md bg-slate-300 bg-opacity-100 m-2"
          >
            {/* Dropdown to select event date */}
            <option value="2025-03-24">March 24, 2025</option>
            <option value="2025-03-25">March 25, 2025</option>
            <option value="2025-03-26">March 26, 2025</option>
            <option value="2025-03-27">March 27, 2025</option>
            <option value="2025-03-28">March 28, 2025</option>
          </select>
          <Dialog
            title="Enter the Start Time And End Time"
            body={
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    className="w-[90%] px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={this.state.startTime}
                    onChange={this.handleInputChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    className={`w-[90%] px-3 py-2 mt-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      this.state.timeError ? 'border-red-500' : ''
                    }`}
                    type="time"
                    name="endTime"
                    id="endTime"
                    value={this.state.endTime}
                    onChange={this.handleInputChange}
                  />
                  <p
                    className={`text-sm mt-1  ${
                      this.state.timeError ? `text-red-500` : `text-transparent`
                    } `}
                  >
                    {this.state.timeError}
                  </p>
                </div>
              </div>
            }
            positiveButton={{
              label: 'Submit',
              handler: this.SubmitSlottingForm,
            }}
            negativeButton={{
              label: 'Cancel',
              handler: this.closeSlottingForm,
            }}
            show={this.state.showSlottingForm}
          />
        </div>
      )
    ) : (
      <div>Please wait while we check for slots...</div>
    );
}