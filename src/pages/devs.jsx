import React from "react";
import { GoHeart, GoCode } from "react-icons/go";

import Layout from "../layouts/app";
import Loader from "../commons/Loader";
import getContributors from "../utils/getContributors";

const styles = {
  userCard: {
    display: "flex",
    alignItems: "center",
    margin: 20,
    padding: 10,
    minWidth: 300,
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

const UserCard = (props) => (
  <a
    href={props.url}
    title={props.username}
    target="_blank"
    rel="noopener noreferrer"
    css={{
      ...styles.userCard,
      ":hover img": {
        filter: "saturate(100%)",
      },
    }}
  >
    <div css={{
      marginRight: 20,
      width: 100,
      height: 100,
    }}>
      <img
        src={props.avatar}
        alt={props.username}
        height="100"
        width="100"
        css={{
          boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
          filter: "saturate(0%)",
          transition: "filter .2s ease-out",
          borderRadius: 3,
        }}
      />
    </div>
    <div>
      <div>{props.username}</div>
      <div css={{ color: "rgba(0, 0, 0, .5)", fontSize: "0.8em" }}>{props.contributions}</div>
    </div>
  </a>
);

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contributors: [],
    };
  }

  componentWillMount = () => {
    getContributors().then(contributors =>
      this.setState({
        contributors: Object.values(contributors),
      })
    );
  };

  render = () => (
    <Layout>
      <div css={{
        textAlign: "center",
      }}>
        <h2 className="mucapp">Developers</h2>
        <p css={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          People who made this with&ensp;<GoCode />&ensp;and&ensp;<GoHeart />!
        </p>
      </div>
      <div css={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {
          this.state.contributors.length
            ? this.state.contributors.map((user, i) => (
              <UserCard
                key={i}
                username={user.login}
                contributions={user.contributions + " Contributions"}
                avatar={user.avatar}
                url={user.url}
              />
            ))
            : <Loader />
        }
      </div>
    </Layout>
  );
}
