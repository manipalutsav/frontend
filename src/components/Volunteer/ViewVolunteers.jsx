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
        this.setState({ volunteers: resp.data.volunteer, mes: resp.message })
    }

    componentWillMount() {
        this.getCollegeVolunteer();
        console.log(this.state.volunteers);

    }
    render() {
        const volunteers = this.state.volunteers

        return !volunteers ? 'No Volunteers' : volunteers.map((volunteer) => {
            return (
                <div key={volunteer._id}>
                    <span>Name</span>&nbsp;&nbsp;<span>Regno</span>&nbsp;&nbsp;<span>Size</span> <br />
                    <span>{volunteer.name1}</span> &nbsp;&nbsp;
                    <span>{volunteer.regno1}</span> &nbsp;&nbsp;
                    <span>{volunteer.size1}</span> &nbsp;&nbsp;
                    <span>{volunteer.name2}</span> &nbsp;&nbsp;
                    <span>{volunteer.regno2}</span> &nbsp;&nbsp;
                    <span>{volunteer.size2}</span> &nbsp;&nbsp;
                </div>
            )
        })
    }
}

