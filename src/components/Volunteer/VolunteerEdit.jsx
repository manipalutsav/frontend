import React from "react";
import Select from "react-select";

import { deleteVolunteer, getVolunteer, updateVolunteer } from "../../services/volunteerService";
import { Input, Button } from "../../commons/Form";
import { getColleges } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
import { navigate } from "gatsby";
import Loader from "../../commons/Loader";
import { keyToDisplay } from "../../utils/common";
import Block from "../../commons/Block";

const sizes = [
    { value: 'XS', label: 'Extra Small' },
    { value: 'S', label: 'Small' },
    { value: 'M', label: 'Medium' },
    { value: 'L', label: 'Large' },
    { value: 'XL', label: 'Extra Large' },
    { value: 'XXL', label: 'Extra Extra Large' },
];

class VolunteerEdit extends React.Component {
    UPDATE_VOLUNTEER = "Update";
    DELETE_VOLUNTEER = "Delete";
    UPDATING_VOLUNTEER = "Updating...";
    DELETING_VOLUNTEER = "Deleting...";
    state = {
        updateButtonText: this.UPDATE_VOLUNTEER,
        deleteButtonText: this.DELETE_VOLUNTEER,
        name: "",
        registerNumber: "",
        phoneNumber: "",
        shirtSize: null,
        collegeId: null,
        colleges: [],
        volunteer: null
    };

    componentWillMount() {
        this.getColleges();
        this.getVolunteer();
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

    updateVolunteer = async () => {
        try {
            this.setState({ updateButtonText: this.UPDATING_VOLUNTEER });
            let { name, registerNumber, phoneNumber, shirtSize, collegeId } = this.state;
            name = name.trim();
            if (!name || name.length === 0)
                throw Error("Please enter name.");
            if (!registerNumber || registerNumber.length === 0)
                throw Error("Please enter register number.");
            if (!String(registerNumber).match(/^\d{4,}$/))
                throw Error("Please enter valid register number.");
            if (this.props.type != "event") {
                if (!String(phoneNumber).match(/^\d{4,}$/))
                    throw Error("Please enter valid phone number.");
                if (!shirtSize || shirtSize.length === 0)
                    throw Error("Please select shirt size.");
            }
            if (!collegeId || collegeId.length === 0)
                throw Error("Please select the college.");

            let response = await updateVolunteer(this.state._id, {
                name,
                registerNumber,
                phoneNumber,
                shirtSize,
                collegeId,
                type: this.props.type
            });
            this.setState({
                updateButtonText: this.UPDATE_VOLUNTEER,
            })
            if (response.status !== 200)
                toast(response.message + ": " + response.data);
            else {
                navigate("../")
            }
            this.setState({ name: "", registerNumber: "", phoneNumber: "" })


        }
        catch (err) {
            toast(err.message)
            this.setState({ updateButtonText: this.UPDATE_VOLUNTEER });
        }
    }

    deleteVolunteer = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this record?")) {
                toast("Skipped deletion")
                return;
            }
            this.setState({ deleteButtonText: this.DELETING_VOLUNTEER });

            let response = await deleteVolunteer(this.state._id);
            this.setState({
                deleteButtonText: this.DELETE_VOLUNTEER,
            })
            if (response.status !== 200)
                toast(response.message + ": " + response.data);
            else {
                navigate("../")
            }
            this.setState({ name: "", registerNumber: "", phoneNumber: "" })

        }
        catch (err) {
            toast(err.message)
            this.setState({ deleteButtonText: this.UPDATE_VOLUNTEER });
        }
    }

    getVolunteer = async () => {
        const response = await getVolunteer(this.props.volunteerId);
        if (response.status === 200) {
            const volunteer = response.data;
            this.setState({ ...volunteer })
        }
        else
            toast("Failed to fetch volunteers");
    }

    render() {
        return (
            <div >
                <div>
                    <div>
                        <h2 className="mucapp">Edit {keyToDisplay(this.props.type)}  Volunteer</h2>
                    </div>
                </div>
                <div className="coreVolunteers">
                    {this.state.colleges.length > 0 && this.state._id ?
                        <table className="vtable">
                            <thead>
                                <tr>
                                    <th>Sl. No.</th>
                                    <th>Name</th>
                                    <th>Register Number</th>
                                    <Block show={this.props.type != "event"}>
                                        <th>Phone Number</th>
                                        <th>Shirt Size</th>
                                    </Block>
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
                                    <Block show={this.props.type != "event"}>
                                        <td>
                                            <Input
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                                name={`phoneNumber`}
                                                type="number"
                                                placeholder="Enter Phone Number"
                                                value={this.state.phoneNumber}
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
                                                name={`shirtSize`}
                                                placeholder="T Shirt Sizes"
                                                defaultValue={sizes[sizes.findIndex(size => size.value === this.state.shirtSize)]}
                                                options={sizes}
                                                onChange={(e) => this.setState({ [`shirtSize`]: e.value })}
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
                                    </Block>
                                    <td>
                                        <Select
                                            isSearchable={false}
                                            name="college"
                                            placeholder="College"
                                            defaultValue={this.state.colleges[this.state.colleges.findIndex(college => college.value === this.state.collegeId)]}
                                            options={this.state.colleges}
                                            onChange={(e) => this.setState({ collegeId: e.value })}

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
                                        <Button onClick={this.updateVolunteer}>{this.state.updateButtonText}</Button>
                                        <Button onClick={this.deleteVolunteer}>{this.state.deleteButtonText}</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table> : <><Loader /></>}
                </div>
            </div >
        )
    }
}

export default VolunteerEdit
