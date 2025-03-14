import React from 'react';
import { Link } from 'gatsby';
import { FiX } from 'react-icons/fi';
import './style.css';

import reducer from '../../reducers/commonReducer';
import { getAll, deleteJudgeById } from '../../services/judgeServices';
import Loader from '../../commons/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const styles = {
  judgeCard: {
    // display: "inline-block",
    // marginRight: 20,
    // marginBottom: 20,
    padding: 20,
    height: 'auto',
    width: '100%',
    borderRadius: 3,
    border: '2px solid rgba(0, 0, 0, .1)',
    color: 'inherit',
    boxShadow: '0px 5px 20px -4px rgba(0, 0, 0, .1)',
    transition: 'box-shadow .2s ease',
    ':hover': {
      color: 'inherit',
      boxShadow: '0px 5px 50px -4px rgba(0, 0, 0, .1)',
    },
  },
};

/*
Currently we are deleteing the judge regardless of whether it has associated rounds or not. This is because we should be able to delete previous years judges also. If you want to restrict the deletion to only judges without associated rounds, we have to just remove the commented code.
*/
const Judge = (props) => {
  let handleDelete = async (judge) => {
    if (
      typeof window !== 'undefined' &&
      window.confirm(`Are you sure you want to delete the judge ${judge.name}?`)
    ) {
      // if (!judge.rounds.length) {
      try {
        await deleteJudgeById(judge.id);
        getAll(); // Refresh the judges list after deletion
      } catch (error) {
        console.error('Error deleting judge:', error);
      }
      // } else {
      //   alert("Cannot delete judge assigned to rounds.");
      // }
    }
  };

  return (
    <div
      css={{
        ...styles.judgeCard,
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{props.info.name}</span>
        <span
          css={{
            cursor: 'pointer',
            ':hover': {
              color: 'red',
            },
          }}
        >
          <FiX onClick={() => handleDelete(props.info)} />
        </span>
      </div>
      <div
        css={{
          fontSize: '.7em',
          color: 'grey',
        }}
      >
        {'Judged ' +
          props.info.rounds.length +
          ' round' +
          (props.info.rounds.length === 1 ? '' : 's')}
      </div>
    </div>
  );
};

const JudgesList = (props) => (
  <div className="h-auto w-full grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
    <Link
      to="/judges/add"
      css={{
        ...styles.judgeCard,
        backgroundColor: '#ff5800',
        transition: 'All 200ms ease-in-out',
        fontWeight: 'semi-bold',
        color: 'white',
        ':hover': {
          boxShadow: '0px 5px 50px -4px rgba(0, 0, 0, .1)',
          backgroundColor: '#ffd100',
          color: 'black',
        },
      }}
    >
      Add Judge
    </Link>
    {props.judges
      ? props.judges
          .filter((item) =>
            item.name.toLowerCase().includes(props.searchQuery.toLowerCase())
          )
          .map((judge, i) => <Judge info={judge} key={i} />)
      : null}
  </div>
);

export default class Judges extends React.Component {
  state = {
    judges: [],
    loading: true,
    searchQuery: '',
  };

  componentWillMount() {
    getAll();

    this.unsubscribe = reducer.subscribe(() => {
      reducer.getState().then((state) => {
        this.setState({ judges: state.data.list, loading: false });
      });
    });
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => (
    <div>
      <h2 className="mucapp">Judges</h2>
      <div className="flex justify-start items-start">
        <div className=" border border-1 border-slate-400 mt-2 flex justify-center items-center rounded-full px-2 mb-5 w-full md:w-1/2 lg:w-1/3 xl:w-72">
          <input
            type="text"
            placeholder="Search by judge name"
            value={this.state.searchQuery}
            onChange={this.handleSearch}
            title="Enter the event name to search"
            className="h-full px-2 py-3 w-full rounded-full outline-none text-md"
          />
          <div
            className="clear-icon-container"
            onClick={() => {
              this.setState({ searchQuery: '' });
            }}
            title="Clear"
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
        </div>
      </div>
      <div className="">
        {this.state.loading ? (
          <Loader />
        ) : (
          <JudgesList
            judges={this.state.judges}
            searchQuery={this.state.searchQuery}
          />
        )}
      </div>
    </div>
  );
}
