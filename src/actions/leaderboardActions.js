import reducer from "../reducers/leaderboardReducer.js";

export const createEventLeaderboard = (eventId) => {
  reducer.dispatch({type: 'CREATE', eventId});
}

export const createRoundLeaderboard = (eventId, roundId) => {
  reducer.dispatch({type: 'CREATE', eventId, roundId});
}

export const createLeaderboard = (eventId, roundId) => {
  reducer.dispatch({type: 'CREATE', eventId, roundId});
}
