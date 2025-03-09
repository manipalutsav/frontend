import reducer from "../reducers/eventReducer.js";

export const create = (payload) => {
  reducer.dispatch({type: 'CREATE', payload});
}

export const createRound = (payload, eventId) => {
  reducer.dispatch({type: 'CREATE_ROUND', payload, eventId});
}

export const createTeam = (payload, eventId) => {
  reducer.dispatch({type: 'CREATE_TEAM', payload, eventId});
}

export const createSlots = (payload, eventId, roundId) => {
  reducer.dispatch({type: 'CREATE_SLOTS', payload, eventId, roundId});
}

export const submitScore = (payload, eventId, roundId) => {
  reducer.dispatch({type: 'SUBMIT_SCORE', payload, eventId, roundId});
}

export const get = () => {
  reducer.dispatch({type: 'GET'});
}

export const getTeams = (eventId) => {
  reducer.dispatch({type: 'GET_TEAMS', eventId});
}

export const getRounds = (eventId) => {
  reducer.dispatch({type: 'GET_ROUNDS', eventId});
}

export const getRoundTeams = (eventId, roundId) => {
  reducer.dispatch({type: 'GET_ROUND_TEAMS', eventId, roundId});
}

export const getSlots = (eventId, roundId) => {
  reducer.dispatch({type: 'GET_SLOTS', eventId, roundId});
}

