import React from "react";
import { getUser } from "../../services/userServices";
import { Link } from "gatsby";
import { getVolunteer } from "../../services/volunteerService";

const styles = {
    volunteerCard: {
        display: "inline-block",
        marginRight: 20,
        marginBottom: 20,
        padding: 20,
        width: 250,
        borderRadius: 3,
        border: "2px solid rgba(0, 0, 0, .1)",
        color: "inherit",
        boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
        transition: "box-shadow .2s ease",
        ":hover": {
            color: "inherit",
            boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
        }
    },
};

let user;
export default class AddVolunteer extends React.Component {

    state = {
        col: 0,
        type: 0,
    }
    componentWillMount() {
        user = getUser();
        console.log(user);

    }
    render() {
        return (
            <div>
                <h1>Volunteer</h1>
                <p>Add Core Volunteer and Event Volunteer</p>
                <div css={{
                    display: "flex",
                    flexWrap: "wrap",
                }}>
                    <br /><br /><br /><br />
                    <Link to="/addVol" css={{
                        ...styles.volunteerCard,
                        backgroundColor: "#ff5800",
                        color: "white",
                        ":hover": {
                            color: "white",
                            boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
                        }
                    }}>
                        Add Core Volunteer
                </Link>
                    <Link to="/eventVolunteer" css={{
                        ...styles.volunteerCard,
                        backgroundColor: "#ff5800",
                        color: "white",
                        ":hover": {
                            color: "white",
                            boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
                        }
                    }}>
                        Add Event Volunteer
                </Link>
                    {/* {
                        user.type == 1 ?
                            <Link to="/viewCoreVolunteer" css={{
                                ...styles.volunteerCard,
                                backgroundColor: "#ff5800",
                                color: "white",
                                ":hover": {
                                    color: "white",
                                    boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
                                }
                            }}>
                                View Volunteers
                </Link>
                            : null

                    } */}
                </div>
            </div>
        )
    }
}

