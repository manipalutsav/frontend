import request from "../utils/request"
import constants from '../utils/constants';
import { send } from '../actions/commonActions';
import { toast } from '../actions/toastActions';

export const get = async () => {
  let response = await request(`${constants.server}/events`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
    return response;
  } else {
    return null;
  }
}

export const getRounds = async (eventId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const getSlots = async (eventId, roundId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds/${roundId}/slots`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const getTeams = async (eventId) => {
  let response = await request(`${constants.server}/events/${eventId}/teams`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const getTeams2 = async (eventId) => {
  try{
    let response = await request(`${constants.server}/events/${eventId}/teams`);

    if (response.status && response.status === 200) return response.data;
    toast(response.message);
  }
  catch (err) {
    toast(err.message);
  }
}

export const getRoundTeams = async (eventId, roundId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds/${roundId}/teams`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const create = async (payload) => {
  let response = await request(`${constants.server}/events`, "POST", payload);

  return response;
}

export const edit = async (event,payload) => {
  let response = await request(`${constants.server}/events/${event}/edit`, "POST", payload);

  return response;
}


export const createRound = async (payload, eventId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const createTeam = async (payload, eventId) => {
  let response = await request(`${constants.server}/events/${eventId}/teams`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const createSlots = async (payload, eventId, roundId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds/${roundId}/slots`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}

export const submitScore = async (payload, eventId, roundId) => {
  let response = await request(`${constants.server}/events/${eventId}/rounds/${roundId}/scores`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    return null;
  }
}
