import React from "react";
import { Link } from "gatsby";
import { FiX } from "react-icons/fi";
import './style.css'

import reducer from "../../reducers/commonReducer";
import { getAll } from "../../services/judgeServices";
import Loader from "../../commons/Loader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'


const styles = {
  judgeCard: {
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

const Judge = (props) => {
  let handleDelete = (judge) => {
    typeof window !== "undefined"
      && window.confirm("Are you sure you want to delete the judge " + judge.name + "?");
    // if (surety && !judge.rounds.length)
    // TODO: DELETE /judges/:judge
  }

  return (
    <div css={{
      ...styles.judgeCard,
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
      }}>{"Judged " + props.info.rounds.length + " round" + (props.info.rounds.length === 1 ? "" : "s")}</div>
    </div>
  )
};

const JudgesList = (props) => (
  <div css={{
    display: "flex",
    flexWrap: "wrap",
  }}>
    <Link to="/judges/add" css={{
      ...styles.judgeCard,
      backgroundColor: "#ff5800",
      color: "white",
      ":hover": {
        color: "white",
        boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
      }
    }}>
      Add Judge
    </Link>
    {
      props.judges ? props.judges
        .filter(item =>
          item.name.toLowerCase().includes(props.searchQuery.toLowerCase())
        )
        .map((judge, i) => (
          <Judge info={judge} key={i} />
        )) : null}
  </div>
);

export default class Judges extends React.Component {
  state = {
    judges: [],
    loading: true,
    searchQuery: ""
  };

  componentWillMount() {
    getAll();

    this.unsubscribe = reducer.subscribe(() => {
      reducer.getState().then(state => {
        this.setState({ judges: state.data.list, loading: false });
      });
    });
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value })
  };


  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => (
    <div>
      <h2 className="mucapp">Judges</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Judge name"
          value={this.state.searchQuery}
          onChange={this.handleSearch}
          title="Enter the judge name to search"
        />
        <div className="clear-icon-container" onClick={() => { this.setState({ searchQuery: "" }) }} title="Clear">
          <FontAwesomeIcon icon={faClose} />
        </div>
      </div>
      <div>
        {
          this.state.loading
            ? <Loader />
            : <JudgesList judges={this.state.judges} searchQuery={this.state.searchQuery} />
        }
      </div>
    </div>
  );
};
