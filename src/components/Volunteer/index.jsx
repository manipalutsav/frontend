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
        buttonText: this.ADD_VOLUNTEER,
        count: 6
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

    handleClick = async () => {
        try {
            await this.setState({ buttonText: this.ADDING_VOLUNTEER });
            const { count, college } = this.state;
            if (!college)
                throw Error("Please select the college.");
            const list = [];
            for (let i = 0; i < count; i++) {
                if (!this.state[`name-${i}`])
                    throw Error(`Please enter volunteer ${i + 1} name`)
                if (!this.state[`regno-${i}`])
                    throw Error(`Please enter volunteer ${i + 1} register number`)
                if (!this.state[`shirtSize-${i}`])
                    throw Error(`Please enter volunteer ${i + 1} shirt size`)
                list.push({
                    name: this.state[`name-${i}`],
                    regno: this.state[`regno-${i}`],
                    shirtSize: this.state[`shirtSize-${i}`]
                })
            }
            let response = await create({
                college,
                list
            });
            this.setState({
                buttonText: this.ADD_VOLUNTEER,
            })
            toast(response.message);
            return navigate("/")
        }
        catch (err) {
            toast(err.message)
            this.setState({ buttonText: this.ADD_VOLUNTEER });
        }
    }


    render() {
        console.log(this.state)
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
                <div>
                    <h3>No. of vounteers:&nbsp;
                    <Input
                            onChange={this.handleChange}
                            autoComplete="off"
                            name="count"
                            type="text"
                            placeholder="Enter number of volunteers"
                            required
                            value={this.state.count}
                            styles={{ width: 300 }}
                            css={{
                                float: "left",
                            }} />
                    </h3>
                </div>

                {Array(Number(this.state.count)).fill(0).map((i, j) =>
                    <div key={j}>
                        <h3>Volunteer {j + 1}</h3>
                        <Input
                            onChange={this.handleChange}
                            autoComplete="off"
                            name={`name-${j}`}
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
                            name={`regno-${j}`}
                            type="text"
                            placeholder="Registration Number"
                            required
                            styles={{ width: 300 }}
                            css={{
                                float: "left",

                            }}
                        />
                        <Select
                            isSearchable={false}
                            name={`shirtSize-${j}`}
                            placeholder="T Shirt Sizes"
                            options={sizes}
                            onChange={(e) => this.setState({ [`shirtSize-${j}`]: e.value })}
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
                    </div>)
                }


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
