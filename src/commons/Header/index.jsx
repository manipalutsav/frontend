import React, { Component, useState, useEffect } from "react";
import { Link } from "gatsby";
import { FiMenu, FiX, FiUser } from 'react-icons/fi'
import sidebarStore from '../../reducers/sidebarReducer';
import userStore from '../../reducers/userReducer';
import { open, close } from '../../actions/sidebarActions';
import { getUser, isLoggedIn } from "../../services/userServices";
import { Dropdown } from "rsuite";
import store from "../../reducers/sidebarReducer";



const SidebarItems = ({ backupName, backupData }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    const _isAdmin = isLoggedIn() && getUser().type <= 2;
    if (_isAdmin != isAdmin) {
      setIsAdmin(_isAdmin);// Admin or support
      console.log("Render sidebar")
    }
  },)
  return (
    <ul css={{
      position: "relative",
      display: "flex",
      flexDirection: "row",
      fontSize: "18px",
      fontWeight: "lighter",
      margin: 0,
      listStyle: "none",
      padding: 0,
    }}>
      <SidebarItem to="/" title="HOME" />
      <SidebarItem to="/register" title="REGISTER" />
      <SidebarItem to="/teams" title="TEAMS" />
      <SidebarItem to="/slots" title="SLOTS" />
      <SidebarItem to="/volunteers" title="VOLUNTEERS" /> 
      <SidebarItem to="/leaderboard/public" title="EVENT STANDINGS" />
      <SidebarItem to="/practice-slots/public" title="PRACTICE SLOTS" />

      {isAdmin &&
        <li css={{ width: 150 }}><Dropdown
          style={{
            fontSize: "30px",
            color: "#999",
            // paddingTop: "20px", 
            // marginLeft: "40px", 
            width: "50px"
          }}
          title="ADMIN ONLY">
          <Dropdown.Item as="a">
            <DropItem to="/users" title="Users" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItem to="/colleges" title="Colleges" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItem to="/events" title="Events" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItem to="/judges" title="Judges" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItem to="/notifications" title="Notifications" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItem to="/practice-slots" title="Practice Slots" />
          </Dropdown.Item>



          {/* <Dropdown.Item as="a">
                                <SidebarItem to="/winners" title="Winners" />
                                </Dropdown.Item> */}

          <Dropdown.Item as="a">
            <DropItem to="/leaderboard" title="Event Standings" />
          </Dropdown.Item>

          <Dropdown.Item as="a">
          <DropItem to="/settings" title="Settings" />
        </Dropdown.Item>

          <Dropdown.Item as="a">
            <DropItemwithDownload to={backupData} title="🗂 Backup" download={backupName} />
          </Dropdown.Item>

          

        </Dropdown>
        </li>
      }

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
      <SidebarItem to="/stats" title="STATS" />
    </ul>
  )
};


//separate dropdown item component defined with the download attribute with <a> tag
const DropItemwithDownload = ({ to, title, download }) => (
  <a
    href={to}
    download={download} // Adding the download attribute here
    title={title}
    css={{
      display: "flex",
      width: "100%",
      padding: 10,
      textDecoration: "none !important",
      ":hover": {
        color: "#003B73",
      },
    }}
  >
    {title}
  </a>
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
      // padding: 10,
      margin: "5px 5px",
      marginTop: 10,
      padding: "5px 18px",
      fontSize: "14px",
      fontWeight: 500,
      textDecoration: "none !important",
      color: path() === props.to ? "#003B73" : "black",
      // backgroundColor: path() === props.to ? "#BFD7ED" : "",
      borderBottom: "3px solid",
      borderColor: path() === props.to ? "#ff5800" : "white",
      transition: "100ms border-bottom ease-in-out",
      // border: "2px solid red",
      ":hover": {
        color: "#003B73",
        borderBottom: "3px solid #ff5800",
      },
    }}>
      {props.title}
    </Link>
  </li>
);

const DropItem = (props) => (
  <Link to={props.to} title={props.title} css={{
    display: "flex",
    width: "100%",
    padding: 10,
    textDecoration: "none !important",
    color: path() === props.to ? "#003B73" : "inherit",
    backgroundColor: path() === props.to ? "#BFD7ED" : "",
    ":hover": {
      color: "#003B73",
    },
  }}>
    {props.title}
  </Link>
);



const HeaderLogo = () => (
  <Link to="/" className="mucapp">
    <div css={{
      display: "flex",
      transform: "translateY(-20%)",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 20px",
    }}>
      <div css={{
        fontFamily: "TCFColar",
        fontSize: "1.5em",
      }}>
        MUCAPP
      </div>
    </div>
  </Link>
);

class UserLink extends Component {
  state = {
    loggedIn: false,
    backupName: "", // Initialize backupName state
    backupData: "", // Initialize backupData state
    screenWidth: (typeof window !== "undefined") ? window.innerWidth : "", // Initialize screenWidth state
  };

  async checkLoggedIn() {
    let userState = await userStore.getState();

    this.setState({ loggedIn: !!userState });
  }

  componentDidMount() {
    this.checkLoggedIn();

    userStore.subscribe(() => {
      this.checkLoggedIn();
    });


    // Add event listener for window resize
    if (typeof window !== "undefined") {
      window.addEventListener('resize', this.handleResize);
    }


    store.subscribe(() => {
      this.setState({ open: store.getState() === "open" });
      this.updateBackup();
    });
    setInterval(this.updateBackup, 5000);
    this.updateBackup();

  }

  componentWillUnmount() {
    // Remove event listener when component unmounts
    if (typeof window !== "undefined") {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize = () => {
    // Update screenWidth state when window is resized
    this.setState({ screenWidth: window.innerWidth });
  }

  // componentDidMount() {
  //   store.subscribe(() => {
  //     this.setState({ open: store.getState() === "open" });
  //     this.updateBackup();
  //   });
  //   setInterval(this.updateBackup, 5000);
  //   this.updateBackup();
  // }

  updateBackup = () => {
    this.setState({
      backupData: "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage)),
      backupName: "mucapp-" + new Date().toJSON() + ".json"
    })
  }

  render = () => (
    <div css={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>

      {this.state.screenWidth > 1024 && (
        <div className="no-print">
          <SidebarItems backupName={this.state.backupName} backupData={this.state.backupData} />
        </div>
      )}


      <Link to={this.state.loggedIn ? "/profile" : "/login"}
        css={{ textDecoration: "none" }}>
        <button className="mucapp flex items-center justify-center" css={{
          margin: "0 20px",
        }}>
          <FiUser/><span className="ml-2">{this.state.loggedIn ? "Profile" : "Login"}</span>
        </button>
      </Link>

    </div>
  );
}

class NavigationToggle extends Component {
  state = {
    menu: "close",
  };

  componentDidMount() {
    sidebarStore.subscribe(() => {
      let storeState = sidebarStore.getState();
      this.setState({ menu: storeState });
    });
  }

  handleBlur = () => {
    if (window.innerWidth <= 1800 || document.body.clientWidth <= 1800) {
      close(); // Close sidebar when navigation toggle loses focus and width is less than 821px
    }
  }

  render = () => (
    <button
      css={{
        fontSize: "1.2em",
        margin: "0 20px",
      }}
      onClick={this.state.menu === "close" ? open : close}
      onBlur={this.handleBlur}
    >
      {
        this.state.menu === "close"
          ? <FiMenu />
          : <FiX />
      }
    </button>
  );
}

export default class Header extends Component {
  state = {
    backupName: "", // Initialize backupName state
    backupData: "", // Initialize backupData state
    screenWidth: (typeof window !== "undefined") ? window.innerWidth : "", // Initialize screenWidth state
  };

  componentDidMount() {
    this.updateBackup();

    // Add event listener for window resize
    if (typeof window !== "undefined") {
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount() {
    // Remove event listener when component unmounts
    if (typeof window !== "undefined") {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize = () => {
    // Update screenWidth state when window is resized
    this.setState({ screenWidth: window.innerWidth });
  }


  updateBackup = () => {
    // Update backupName and backupData states
    this.setState({
      backupData: "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage)),
      backupName: "mucapp-" + new Date().toJSON() + ".json"
    })
  }
  render = () => (
    <header className="no-print" css={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "10vh",
      boxShadow: "0 5px 50px 10px #f0f1f2",
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      padding: "0 2%",
      zIndex: 10000,

    }}>

      {/* <NavigationToggle /> */}
      {this.state.screenWidth <= 1024 && <NavigationToggle />}
      <HeaderLogo backupName={this.state.backupName} backupData={this.state.backupData} screenWidth={this.state.screenWidth} />
      <UserLink />
    </header>
  );
}
