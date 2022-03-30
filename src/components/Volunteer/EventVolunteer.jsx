import React from "react";
import Select from "react-select";

import { addEventVolunteer, getEventVolunteers } from "../../services/volunteerService";
import { Input, Button } from "../../commons/Form";
import { getColleges } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";


class EventVolunteer extends React.Component {
    ADD_VOLUNTEER = "Add";
    state = {
        buttonText: this.ADD_VOLUNTEER,
        name: "",
        registerNumber: "",
        college: null,
        volunteers: []
    };

    componentWillMount() {
        this.getColleges();
        this.getVolunteers();
    }

    getColleges = async () => {
        let response = await getColleges();
        if (response.status === 200) {
            const colleges = response.data.map(college => ({
                value: college.id,
                label: college.name + ", " + college.location
            }))
            this.setState({ colleges })
        }
        else
            toast("An error occured while fetching colleges");
    }

    handleChange = (e) => {
        this.setState({
            [e.name]: e.value,
        });
    };

    addVolunteer = async () => {
        try {
            await this.setState({ buttonText: this.ADDING_VOLUNTEER });
            let { name, registerNumber, college } = this.state;
            name = name.trim();
            if (!name || name.length === 0)
                throw Error("Please enter name.");
            if (!registerNumber || registerNumber.length === 0)
                throw Error("Please enter register number.");
            if (!registerNumber.match(/^\d{4,}$/))
                throw Error("Please enter valid register number.");
            if (!college || college.length === 0)
                throw Error("Please select the college.");
            let response = await addEventVolunteer({
                name,
                registerNumber,
                college
            });
            this.setState({
                buttonText: this.ADD_VOLUNTEER,
            })
            toast(response.message);
            this.getVolunteers();
            this.setState({ name: "", registerNumber: "" })

        }
        catch (err) {
            toast(err.message)
            this.setState({ buttonText: this.ADD_VOLUNTEER });
        }
    }

    getVolunteers = async () => {
        const response = await getEventVolunteers();
        if (response.status === 200) {
            const volunteers = response.data;
            this.setState({ volunteers })
        }
        else
            toast("Failed to fetch volunteers");
    }

    render() {
        return (
            <div >
                <div>
                    <div>
                        <h2>Event Volunteers</h2>
                    </div>
                </div>
                <div className="coreVolunteers">
                    <table className="vtable">
                        <thead>
                            <tr>
                                <th>Sl. No.</th>
                                <th>Name</th>
                                <th>Register Number</th>
                                <th>College</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td />
                                <td>
                                    <Input
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                        name={`name`}
                                        type="text"
                                        value={this.state.name}
                                        placeholder="Enter Name"
                                        required
                                        styles={{ width: 300 }}
                                        css={{
                                            float: "left",

                                        }}
                                    />
                                </td>
                                <td>
                                    <Input
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                        name={`registerNumber`}
                                        type="number"
                                        placeholder="Enter Register Number"
                                        value={this.state.registerNumber}
                                        required
                                        styles={{ width: 300 }}
                                        css={{
                                            float: "left",

                                        }}
                                    />
                                </td>
                                <td>
                                    <Select
                                        isSearchable={false}
                                        name="college"
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
                                            width: 300,
                                        }}
                                    />
                                </td>
                                <td>
                                    <Button onClick={this.addVolunteer}>{this.state.buttonText}</Button>
                                </td>
                            </tr>
                            {
                                this.state.volunteers.map((volunteer, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{volunteer.name}</td>
                                        <td>{volunteer.registerNumber}</td>
                                        <td>{volunteer.college ? (volunteer.college.name || volunteer.college) : ""}</td>
                                        <td></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        )
    }
}

export default EventVolunteer
