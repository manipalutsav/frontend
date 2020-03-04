import React from "react";
import Select from "react-select";

import reducer from "../../reducers/commonReducer";
import { create } from "../../services/volunteerService";
import { Input, Button } from "../../commons/Form";
import { getAll } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
import { navigate } from "gatsby";

const sizes = [

    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'X Large' },
];

class Volunteer extends React.Component {
    ADD_VOLUNTEER = "Add Volunteer";
    state = {
        buttonText: this.ADD_VOLUNTEER
    };

    title = <div>
        <h2>Add Volunteer</h2>
        <p>Add a new Core Volunteer to MUCAPP</p>
    </div>

    componentWillMount() {
        getAll();

        reducer.subscribe(() => {
            reducer.getState().then(state => {
                this.setState({
                    colleges: state.data.list.map(college => ({
                        value: college.id,
                        label: college.name + ", " + college.location,
                    })),
                });
            });
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.name]: e.value,
        });
    };

    addVolunteerButton =
        <div>
            <Button onClick={this.handleClick}>{this.state.buttonText}</Button>
        </div>

    handleClick = () => {
        if (!this.state.name1 || !this.state.regno1 || !this.state.size1) {
            toast("Enter all details");
        }
        else {
            this.setState({
                buttonText: this.state.ADD_VOLUNTEER
            }, async () => {
                let response = await create({
                    college: this.state.college,
                    name1: this.state.name1,
                    regno1: this.state.regno1,
                    size1: this.state.size1,
                    name2: this.state.name2,
                    regno2: this.state.regno2,
                    size2: this.state.size2,
                    name3: this.state.name3,
                    regno3: this.state.regno3,
                    size3: this.state.size3,
                    name4: this.state.name4,
                    regno4: this.state.regno4,
                    size4: this.state.size4,
                    name5: this.state.name5,
                    regno5: this.state.regno5,
                    size5: this.state.size5,
                    name6: this.state.name6,
                    regno6: this.state.regno6,
                    size6: this.state.size6,

                });
                this.setState({
                    buttonText: this.ADD_VOLUNTEER,
                })
                toast(response.message);
                return navigate("/")
            });
        }

    }


    render() {
        return (
            <div>
                <div>
                    <div>
                        <h2>Add Core Volunteer</h2>
                        <p>Add a new Core Volunteer to MUCAPP</p>
                    </div>
                </div>

                <div>
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
                </div>
                {/* Volunteer 1 */}
                <div>
                    <h3>Volunteer 1</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name1"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno1"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size1: e.value })}
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
                </div>

                {/* Volunteer 2  */}
                <div>
                    <h3>Volunteer 2</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name2"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno2"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size2: e.value })}
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
                </div>

                {/* Volunteer 3 */}
                <div>
                    <h3>Volunteer 1</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name3"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno3"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size3: e.value })}
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
                </div>

                {/* Volunteer 4 */}
                <div>
                    <h3>Volunteer 4</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name4"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno4"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size4: e.value })}
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
                </div>
                {/* Volunteer 5 */}
                <div>
                    <h3>Volunteer 5</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name5"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno5"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size5: e.value })}
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

                </div>
                &nbsp;&nbsp;
                {/* Volunteer 6 */}
                <div>
                    <h3>Volunteer 6</h3>
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="name6"
                        type="text"
                        placeholder="Name"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Input
                        onChange={this.handleChange}
                        autoComplete="off"
                        name="regno6"
                        type="text"
                        placeholder="Registration Number"
                        required
                        styles={{ width: 300 }}
                        css={{
                            float: "left",

                        }}
                    />&nbsp;
                    <Select
                        isSearchable={false}
                        name="tshirt-size"
                        placeholder="T Shirt Sizes"
                        options={sizes}
                        onChange={(e) => this.setState({ size6: e.value })}
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
                </div>
                <div>
                    <div>
                        <Button onClick={this.handleClick}>{this.state.buttonText}</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default Volunteer
