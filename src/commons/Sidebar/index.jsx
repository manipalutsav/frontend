import React, { Component } from "react";
import { Link } from "gatsby";
import { Dropdown } from "rsuite";
import "rsuite/dist/rsuite.min.css";


import store from "../../reducers/sidebarReducer";

const SidebarSeparator = () => (
  <li>
    <hr css={{
      margin: "10px 25px 0",
      border: "1px dashed rgba(0, 0, 0, .1)",
    }} />
  </li>
);

const path = () => {
  if (typeof (window) == "undefined")
    return "";
  else
    return window.location.pathname;
}

const SidebarItem = (props) => (
  <li>
    <Link to={props.to} title={props.title} css={{
      display: "block",
      marginTop: 10,
      padding: 10,
      paddingLeft: 50,
      fontSize: ".9em",
      textDecoration: "none !important",
      color: path() === props.to ? "#003B73" : "inherit",
      backgroundColor: path() === props.to ? "#BFD7ED" : "",
      borderRight: "3px solid",
      borderColor: path() === props.to ? "#ff5800" : "white",
      ":hover": {
        color: "#003B73",
      },
    }}>
      {props.title}
    </Link>
  </li>
);

const SidebarItems = ({ backupName, backupData }) => (
  <ul css={{
    display: "flex",
    flexDirection: "column",
    margin: 0,
    marginTop: 20,
    listStyle: "none",
    padding: 0,
  }}>
    <SidebarItem to="/" title="Home" />
    <SidebarItem to="/register" title="Register" />
    <SidebarItem to="/teams" title="Teams" />
    <SidebarItem to="/volunteers" title="Volunteer" />
    <SidebarItem to="/slots" title="Slots" />
    <SidebarItem to="/leaderboard/public" title="Event Standings" />
    {/* <SidebarItem to="/certificates" title="Certificates" /> */}
    {/* <SidebarSeparator />
    <li style={{ fontSize: "0.5em", color: "#999", paddingTop: "20px", paddingLeft: "50px" }}>Admin</li>
    <SidebarItem to="/users" title="Users" />
    <SidebarItem to="/colleges" title="Colleges" />
    <SidebarItem to="/events" title="Events" />
    <SidebarItem to="/judges" title="Judges" />
    <SidebarItem to="/winners" title="Winners" />
    <SidebarItem to="/leaderboard" title="Event Standings"/> */}

    <Dropdown style={{ fontSize: "30px", color: "#999", paddingTop: "20px", marginLeft: "40px", width: "50px"}} title="ADMIN ONLY">
                <Dropdown.Item as="a">
                    <SidebarItem to="/users" title="Users" />
                </Dropdown.Item>
  
                <Dropdown.Item as="a">
                <SidebarItem to="/colleges" title="Colleges" />
                </Dropdown.Item>
  
                <Dropdown.Item as="a">
                <SidebarItem to="/events" title="Events" />
                </Dropdown.Item>

                <Dropdown.Item as="a">
                <SidebarItem to="/judges" title="Judges" />
                </Dropdown.Item>

                {/* <Dropdown.Item as="a">
                <SidebarItem to="/winners" title="Winners" />
                </Dropdown.Item> */}

                <Dropdown.Item as="a">
                <SidebarItem to="/leaderboard" title="Event Standings" />
                </Dropdown.Item>
      </Dropdown>

    <SidebarSeparator />
    {/* <li>
      <a href="/feedback" css={{
        display: "block",
        marginTop: 10,
        padding: 10,
        paddingLeft: 50,
        fontSize: ".9em",
        color: "#222"
      }}>
        Feedback
      </a>
    </li> */}
    <SidebarItem to="/stats" title="Stats" />
    <a href={backupData} download={backupName}>
      <div css={{
        display: "block",
        marginTop: 10,
        padding: 10,
        paddingLeft: 20,
        fontSize: ".9em",
        cursor: "pointer",
        ":hover": {
          color: "#ff5800",
        }
      }}
      >
        <span css={{ padding: 5 }}>🗂</span>Backup
      </div></a>
  </ul>
);

export default class Sidebar extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    store.subscribe(() => {
      this.setState({ open: store.getState() === "open" });
      this.updateBackup();
    });
    setInterval(this.updateBackup, 5000);
    this.updateBackup();
  }

  updateBackup = () => {
    this.setState({
      backupData: "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage)),
      backupName: "mucapp-" + new Date().toJSON() + ".json"
    })
  }

  render = () => (
    <div className="no-print" css={{
      display: "block",
      height: "100vh",
      overflowX: "scroll",
      overflowY: "visible",
      minWidth: 200,
      marginLeft: this.state.open ? 0 : -200,
      minHeight: "100vh",
      boxShadow: "25px 0px 50px -30px rgba(0, 0, 0, .1)",
      transition: "margin .3s ease-out",
      ":hover": {
        overflowY: "auto",
      },
    }}>
      <SidebarItems backupName={this.state.backupName} backupData={this.state.backupData} />
    </div>
  );
}
