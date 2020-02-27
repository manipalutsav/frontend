import React from "react";

import { Link } from "gatsby";

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


export default class AddVolunteer extends React.Component {
    state = {}
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
                    <Link to="/coreVolunteer" css={{
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
                </div>
            </div>
        )
    }
}

