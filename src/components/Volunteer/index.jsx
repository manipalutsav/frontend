import React from "react";
import { Link } from "gatsby";
import { keyToDisplay } from "../../utils/common";

const styles = {
    volunteerCard: {
        display: "inline-block",
        // marginRight: 20,
        // marginBottom: 20,
        padding: 20,
        width: "100%",
        borderRadius: 3,
        border: "2px solid rgba(0, 0, 0, .1)",
        color: "inherit",
        boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
        transition: "all .2s ease",
        ":hover": {
            color: "inherit",
            boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
            transform: "translateY(-10px)"
        }
    },
};
export default class Volunteer extends React.Component {
    render() {
        return (
            <div>
                <h1 className="mucapp"> Volunteers</h1>
                <p>Select the type of volunteers you want to see</p>
                <div className="h-auto w-full mt-5 grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-5">
                    {/* <br /><br /><br /><br /> */}
                    <AddVolunteer type={"core"} />
                    <AddVolunteer type={"event"} />
                    <AddVolunteer type={"mucapp"} />
                    <AddVolunteer type={"design"} />
                    <AddVolunteer type={"social-media"} />
                </div>
            </div >
        )
    }
}

const AddVolunteer = ({ type }) => (
    <Link to={`/volunteers/${type}`} css={{
        ...styles.volunteerCard,
        backgroundColor: "#ff5800",
        transition: "All 200ms ease-in-out",
        color: "white",
        ":hover": {
            boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
            transform: "translateY(-10px)",
            backgroundColor: "#ffd100",
            color: "black"
        }
    }}>
        {keyToDisplay(type)} Volunteers
    </Link>
);
