import React, { Component } from "react";
import { Link } from "gatsby";

import store from "../../reducers/sidebarReducer";

const SidebarSeparator = () => (
  <li>
    <hr css={{
      margin: "10px 25px 0",
      border: "1px dashed rgba(0, 0, 0, .1)",
    }} />
  </li>
);

const path=()=>{
  if(typeof(window)=="undefined")
    return "";
  else
    return window.location.pathname;
}

const SidebarItem = (props) => (
  <li>
    <Link to={ props.to } title={ props.title } css={{
      display: "block",
      marginTop: 10,
      padding: 10,
      paddingLeft: 50,
      fontSize: ".9em",
      color: path() === props.to ? "#ff5800" : "inherit",
      backgroundColor: path() === props.to ? "rgba(255, 209, 0, .2)" : "",
      borderRight: "3px solid",
      borderColor: path() === props.to ? "#ff5800" : "white",
      ":hover": {
        color: "#ff5800",
      },
    }}>
      { props.title }
    </Link>
  </li>
);

const SidebarItems = () => (
  <ul css = {{
    display: "flex",
    flexDirection: "column",
    margin: 0,
    marginTop: 20,
    listStyle: "none",
    padding: 0,
  }}>
    <SidebarItem to="/" title="Home" />
    <SidebarItem to="/register" title="Register" />
    <SidebarItem to="/slots" title="Slots" />
    <SidebarItem to="/leaderboard/public" title="Leaderboard" />
    <SidebarSeparator />
    <SidebarItem to="/users" title="Users" />
    <SidebarItem to="/colleges" title="Colleges" />
    <SidebarItem to="/events" title="Events" />
    <SidebarItem to="/judges" title="Judges" />
    <SidebarItem to="/leaderboard" title="Leaderboard" />
    <SidebarSeparator />
    <SidebarItem to="/stats" title="Stats" />
  </ul>
);

export default class Sidebar extends Component {
  state = {
    open: false
  };

  componentDidMount(){
    store.subscribe(() => {
      this.setState({ open:store.getState() === "open" });
    });
  }

  render = () => (
    <div className="no-print" css = {{
      display: "block",
      height: "100vh",
      overflow: "hidden",
      minWidth: 200,
      marginLeft: this.state.open ? 0 : -200,
      minHeight: "100vh",
      boxShadow: "25px 0px 50px -30px rgba(0, 0, 0, .1)",
      transition: "margin .3s ease-out",
      ":hover": {
        overflowY: "auto",
      },
    }}>
      <SidebarItems />
    </div>
  );
}
