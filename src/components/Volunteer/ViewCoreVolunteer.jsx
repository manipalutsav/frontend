import React, { Component } from 'react'
import { Link } from "gatsby";
import { getAll } from "../../services/collegeServices";
import Loader from "../../commons/Loader";
import reducer from "../../reducers/commonReducer";

//Component designed for viewing the volunteers . 
//Admin purpose only

const styles = {
    collegeCard: {
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

const College = (props) => (
    <Link to={"/viewVolunteers/"+props.info.id}  css={{
        ...styles.collegeCard,
    }}>
        <div>{props.info.name}</div>
        <div css={{
            fontSize: ".9em",
            color: "grey",
        }}>{props.info.location}</div>
        
    </Link>
);

const CollegeList = (props) => (
    <div css={{
        display: "flex",
        flexWrap: "wrap",
    }}>
        {
            props.colleges
                ? props.colleges.map((college, i) => (
                    <College
                        key={i}
                        info={college}
                        stats={props.stats[college.id]}
                    />
                ))
                : null
        }
    </div>
);

export default class ViewCoreVolunteer extends Component {
    state = {
        colleges: [],
        teams: [],
        events: [],
        stats: {},
        loading: true,
    };

    componentWillMount() {
        getAll();

        this.unsubscribe = reducer.subscribe(() => {
            reducer.getState().then(state => {
                this.setState({ colleges: state.data.list, loading: false });
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render = () => (
        <div>
            <h2>Volunteers</h2>
            <p>Volunteers of Utsav.</p>
            <div>
                {
                    this.state.loading
                        ? <Loader />
                        : <CollegeList
                            colleges={this.state.colleges} stats={this.state.stats}
                        />
                }
            </div>
        </div>
    );

}
