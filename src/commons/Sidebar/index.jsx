import React, { Component, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { Dropdown } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { getUser, isLoggedIn } from '../../services/userServices';
import { getSettings } from "../../services/settingsServices";

import store from '../../reducers/sidebarReducer';

const SidebarSeparator = () => (
  <li>
    <hr
      css={{
        margin: '10px 25px 0',
        border: '1px dashed white',
      }}
    />
  </li>
);

const path = () => {
  if (typeof window == 'undefined') return '';
  else return window.location.pathname;
};

const SidebarItem = (props) => (
  <li>
    <Link
      to={props.to}
      title={props.title}
      css={{
        display: 'block',
        marginTop: 10,
        padding: 10,
        paddingLeft: 50,
        fontSize: '.9em',
        textDecoration: 'none !important',
        color: path() === props.to ? '#003B73' : 'inherit',
        backgroundColor: path() === props.to ? '#BFD7ED' : '',
        borderRight: '3px solid',
        borderColor: path() === props.to ? '#ff5800' : 'white',
        ':hover': {
          color: '#003B73',
        },
      }}
    >
      {props.title}
    </Link>
  </li>
);

const DropItem = (props) => (
  <Link
    to={props.to}
    title={props.title}
    css={{
      display: 'flex',
      width: '100%',
      padding: 10,
      textDecoration: 'none !important',
      color: path() === props.to ? '#003B73' : 'inherit',
      backgroundColor: path() === props.to ? '#BFD7ED' : '',
      ':hover': {
        color: '#003B73',
      },
    }}
  >
    {props.title}
  </Link>
);

const SidebarItems = ({ backupName, backupData , navbarDownloadCertificate }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const _isAdmin = isLoggedIn() && getUser().type <= 2;
    if (_isAdmin != isAdmin) {
      setIsAdmin(_isAdmin); // Admin or support
      console.log('Render sidebar');
    }
  });
  return (
    <ul
      css={{
        display: 'inline',
        flexDirection: 'row',
        fontSize: '18px',
        fontWeight: 'lighter',
        margin: 0,
        marginTop: 20,
        listStyle: 'none',
        padding: 0,
      }}
    >
      <SidebarItem to="/" title="HOME" />
      { !navbarDownloadCertificate && <SidebarItem to="/register" title="REGISTER" />}
      <SidebarItem to="/teams" title="TEAMS" />
      <SidebarItem to="/slots" title="SLOTS" />
      <SidebarItem to="/volunteers" title="VOLUNTEERS" />

      <SidebarItem to="/leaderboard/public" title="EVENT STANDINGS" />
      <SidebarItem to="/practice-slots/public" title="PRACTICE SLOTS" />
      <SidebarItem to="/stats" title="STATS" />
      { navbarDownloadCertificate && <SidebarItem to="/certificates" title="CERTIFICATES" />}
      <SidebarSeparator />
      {/* <li style={{ fontSize: "0.5em", color: "#999", paddingTop: "20px", paddingLeft: "50px" }}>Admin</li> */}
      {/* <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;
      <SidebarItem to="/users" title="Users" />
  
  
  
  
       */}
      {isAdmin && (
        <Dropdown
          style={{
            fontSize: '30px',
            color: '#999',
            paddingTop: '20px',
            marginLeft: '40px',
            width: '50px',
          }}
          title="ADMIN ONLY"
        >
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
        </Dropdown>
      )}

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
      {isAdmin && (
        <a href={backupData} download={backupName}>
          <div
            css={{
              display: 'block',
              marginTop: 10,
              padding: 10,
              paddingLeft: 20,
              fontSize: '.9em',
              cursor: 'pointer',
              ':hover': {
                color: '#ff5800',
              },
            }}
          >
            <span css={{ padding: 5 }}>🗂</span>Backup
          </div>
        </a>
      )}
    </ul>
  );
};

export default class Sidebar extends Component {
  state = {
    open: false,
    navbarDownloadCertificate: false,
  };

  componentDidMount() {
    store.subscribe(() => {
      this.setState({ open: store.getState() === 'open' });
      this.updateBackup();
    });
    setInterval(this.updateBackup, 5000);
    this.updateBackup();
    getSettings().then(settings => {
      if (settings) {
        console.log(settings);
        this.setState({
          navbarDownloadCertificate: settings.navbarDownloadCertificate || false,
        })
        console.log(this.state.navbarDownloadCertificate);
      }
    }).catch((err) => {
      console.error(err)
    })

  }

  updateBackup = () => {
    this.setState({
      backupData:
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(localStorage)),
      backupName: 'mucapp-' + new Date().toJSON() + '.json',
    });
  };

  handleBlur = () => {
    if (window.innerWidth <= 1800 || document.body.clientWidth <= 1800) {
      this.setState({ open: false });
    }
  };

  handleFocus = () => {
    if (window.innerWidth <= 1800 || document.body.clientWidth <= 1800) {
      this.setState({ open: true });
    }
  };

  render = () => (
    <div
      className="no-print"
      css={{
        // display: "block",
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0px 5px 8px 0px rgba(0, 0, 0, .25)',
        height: '100vh',
        overflowX: 'scroll',
        overflowY: 'visible',
        zIndex: 100,
        minWidth: 200,
        marginLeft: this.state.open ? 0 : -210,
        minHeight: '100vh',
        boxShadow: '25px 0px 50px -30px rgba(0, 0, 0, .1)',
        transition: 'margin .3s ease-out',
        // border: "2px solid red",
        ':hover': {
          overflowY: 'auto',
        },
      }}
      onBlur={this.handleBlur}
      onFocus={this.handleFocus}
    >
      <SidebarItems
        backupName={this.state.backupName}
        backupData={this.state.backupData}
        navbarDownloadCertificate = {this.state.navbarDownloadCertificate}
      />
    </div>
  );
}
