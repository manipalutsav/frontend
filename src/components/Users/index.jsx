import React from "react";
import { navigate, Link } from "gatsby";
import { FiX } from "react-icons/fi";

import reducer from "../../reducers/commonReducer";
import usersService from "../../services/users";
import { getUser, getAll } from "../../services/userServices";
import constants from "../../utils/constants";
import Loader from "../../commons/Loader";

const styles = {
  userCard: {
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

const getUserType = (type) => {
  for (let userType in constants.USER_TYPES)
    if (constants.USER_TYPES.hasOwnProperty(userType))
      if (constants.USER_TYPES[userType] === type) return userType.replace(/_/g, " ");
};

const User = (props) => {
  let handleDelete = (user) => {
    let surety = typeof window !== "undefined"
      && window.confirm("Are you sure you want to delete " + user.name + "?");

    let me = getUser();

    if (me.type === 1 && surety && user.type !== 1) {
      usersService.remove(user.id).then(() =>
        navigate("/users")
      );
    }
  }

  return (
    <Link to={"/users/" + props.info.id} css={{
      ...styles.userCard,
    }}>
      <div css={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <span>{props.info.name}</span>
        <span css={{
          cursor: "pointer",
          ":hover": {
            color: "red",
          },
        }}>
          <FiX onClick={() => handleDelete(props.info)} />
        </span>
      </div>
      <div css={{
        fontSize: ".7em",
        color: "grey",
      }}>{getUserType(props.info.type)}</div>
    </Link>
  )
};

const UsersList = (props) => (
  <div css={{
    display: "flex",
    flexWrap: "wrap",
  }}>
    <Link to="/users/add" css={{
      ...styles.userCard,
      backgroundColor: "#ff5800",
      color: "white",
      ":hover": {
        color: "white",
        boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
      }
    }}>
      Add User
    </Link>
    {
      props.users
        ? props.users.map((user, i) => (
          <User info={user} key={i} />
        ))
        : null
    }
  </div>
);

export default class Users extends React.Component {
  state = {
    users: [],
    loading: true,
  };

  componentWillMount() {
    getAll();

    this.unsubscribe = reducer.subscribe(() => {
      reducer.getState().then(state => {
        this.setState({ users: state.data.list, loading: false });
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => (
    <div>
      <h2 className="mucapp">Users</h2>
      <p className="pb-3">Users of MUCAPP.</p>
      <div>
        {
          this.state.loading
            ? <Loader />
            : <UsersList users={this.state.users} />
        }
      </div>
    </div>
  );
};
