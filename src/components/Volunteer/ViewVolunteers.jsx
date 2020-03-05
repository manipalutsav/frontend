import React, { Component } from 'react'
import VolunteerService from "../../services/volunteerService";

export default class ViewVolunteers extends Component {
    constructor(props) {
        super();
        console.log(props.collegeId);
    }


    state = {
        volunteers: [],
        mes: null
    }
    getCollegeVolunteer = async () => {
        let resp = await VolunteerService.getCollegeVolunteer(this.props.collegeId);
        console.log(resp.data);
        this.setState({ volunteers: resp.data[0].list, mes: resp.message })
    }

    componentWillMount() {
        this.getCollegeVolunteer();
        console.log(this.state.volunteers);

    }
    render() {
        const volunteers = this.state.volunteers;
        if (volunteers.length == 0)
            return (<div>No Volunteers</div>)

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>RegNo</th>
                            <th>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map(v => (
                            <tr>
                                <td>{v.name}</td>
                                <td>{v.regno}</td>
                                <td>{v.size}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>);
    }
}

