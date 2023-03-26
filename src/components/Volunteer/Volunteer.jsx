import React from "react";
import Select from "react-select";

import { addVolunteer, getVolunteers } from "../../services/volunteerService";
import { Input, Button } from "../../commons/Form";
import { getColleges } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
import { Link } from "gatsby";
import { keyToDisplay } from "../../utils/common";

const sizes = [
    { value: 'XS', label: 'Extra Small' },
    { value: 'S', label: 'Small' },
    { value: 'M', label: 'Medium' },
    { value: 'L', label: 'Large' },
    { value: 'XL', label: 'Extra Large' },
    { value: 'XXL', label: 'Extra Extra Large' },
];

class Volunteer extends React.Component {
    ADD_VOLUNTEER = "Add";
    ADDING_VOLUNTEER = "Adding...";
    state = {
        buttonText: this.ADD_VOLUNTEER,
        name: "",
        registerNumber: "",
        phoneNumber: "",
        shirtSize: null,
        collegeId: null,
        colleges: [],
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
            let { name, registerNumber, phoneNumber, shirtSize, collegeId } = this.state;
            name = name.trim();
            if (!name || name.length === 0)
                throw Error("Please enter name.");
            if (!registerNumber || registerNumber.length === 0)
                throw Error("Please enter register number.");
            if (!registerNumber.match(/^\d{4,}$/))
                throw Error("Please enter valid register number.");
            if (!phoneNumber.match(/^\d{4,}$/))
                throw Error("Please enter valid register number.");
            if (!shirtSize || shirtSize.length === 0)
                throw Error("Please select shirt size.");
            if (!collegeId || collegeId.length === 0)
                throw Error("Please select the college.");

            let response = await addVolunteer({
                name,
                registerNumber,
                phoneNumber,
                shirtSize,
                collegeId,
                type: this.props.type
            });
            this.setState({
                buttonText: this.ADD_VOLUNTEER,
            })
            if (response.status !== 200)
                toast(response.message + ": " + response.data);
            this.getVolunteers();
            this.setState({ name: "", registerNumber: "", phoneNumber: "" })

        }
        catch (err) {
            toast(err.message)
            this.setState({ buttonText: this.ADD_VOLUNTEER });
        }
    }

    getVolunteers = async () => {
        const response = await getVolunteers(this.props.type);
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
                        {/*  */}
                        <h2 className="mucapp">{keyToDisplay(this.props.type)} Volunteers</h2>
                    </div>
                </div>
                <div className="coreVolunteers">
                    <table className="vtable">
                        <thead>
                            <tr>
                                <th>Sl. No.</th>
                                <th>Name</th>
                                <th>Register Number</th>
                                <th>Phone Number</th>
                                <th>Shirt Size</th>
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
                                <td>
                                    <Select
                                        isSearchable={false}
                                        name="college"
                                        placeholder="College"
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
                                    <Button onClick={this.addVolunteer}>{this.state.buttonText}</Button>
                                </td>
                            </tr>
                            {
                                this.state.colleges.length > 0 && this.state.volunteers.map((volunteer, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{volunteer.name}</td>
                                        <td>{volunteer.registerNumber}</td>
                                        <td>{volunteer.phoneNumber}</td>
                                        <td>{volunteer.shirtSize}</td>
                                        <td>{this.state.colleges.find(college => college.value === volunteer.collegeId).label}</td>
                                        <td><Link to={`/volunteers/${this.props.type}/${volunteer._id}`}><button className="mucapp">Edit</button></Link></td>
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

export default Volunteer
