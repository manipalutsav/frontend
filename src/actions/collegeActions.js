import reducer from "../reducers/collegeReducer.js";

export const create = (payload) => {
  reducer.dispatch({type: 'CREATE', payload});
}

export const getAll = () => {
  reducer.dispatch({type: 'GET_ALL'});
}

export const get = () => {
  reducer.dispatch({type: 'GET'});
}

export const getParticipants = (eventId) => {
  reducer.dispatch({type: 'GET_PARTICPANTS', eventId});
}

export const getTeams = (eventId) => {
  reducer.dispatch({type: 'GET_TEAMS', eventId});
}
