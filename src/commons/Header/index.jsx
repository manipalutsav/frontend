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
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      alignItems: "center",
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

  render = () => (
    <button
      css={{
        fontSize: "1em",
        margin: "0 20px",
      }}
      onClick={this.state.menu === "close" ? open : close}
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
      height: 64,
      boxShadow: "0 5px 50px 10px #f0f1f2",
    }}>
      <NavigationToggle />
      <HeaderLogo />
      <UserLink />
    </header>
  );
}
