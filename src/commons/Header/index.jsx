import React, { Component } from "react";
import { Link } from "gatsby";
import { FiMenu, FiX, FiUser } from 'react-icons/fi'
import sidebarStore from '../../reducers/sidebarReducer';
import userStore from '../../reducers/userReducer';
import { open, close } from '../../actions/sidebarActions';

const HeaderLogo = () => (
  <Link to="/" className="mucapp">
    <div css={{
      display: "flex",
      // position: "absolute",
      // top: "50%",
      // left: "50%",
      transform: "translateY(-20%)",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div css={{
        fontFamily: "TCFColar",
        fontSize: "2em",
      }}>
        MUCAPP
      </div>
    </div>
  </Link>
);

class UserLink extends Component {
  state = {
    loggedIn: false
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
  }

  render = () => (
    <Link to={this.state.loggedIn ? "/profile" : "/login"} css={{ textDecoration: "none" }}>
      <button className="mucapp" css={{
        margin: "0 20px",
      }}>
        <FiUser />&ensp;{this.state.loggedIn ? "Profile" : "Login"}
      </button>
    </Link>
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
    if (window.innerWidth <= 1500) {
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
  render = () => (
    <header className="no-print" css={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "10vh",
      boxShadow: "0 5px 50px 10px #f0f1f2",
      // border:"2px solid red",
      // position: "fixed",
      // left: 0,
      // right: 0,
      // top: 0,
      // backgroundColor: "white",
      // zindex: 9,

    }}>
      <NavigationToggle />
      <HeaderLogo />
      <UserLink />
    </header>
  );
}
