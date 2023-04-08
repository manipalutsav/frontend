import request from "../utils/request"
import { send } from '../actions/commonActions';
import { toast } from '../actions/toastActions';

export const get = async () => {
  let response = await request(`/events`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
    return response;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getRounds = async (eventId) => {
  let response = await request(`/events/${eventId}/rounds`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getSlots = async (eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/slots`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getSlots2 = async (eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/slots`);

  if (response.status && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const deleteSlots2 = async (eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/slots/delete`);

  if (response.status && response.status === 200) {
    return true;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getTeams = async (eventId) => {
  let response = await request(`/events/${eventId}/teams`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getTeams2 = async (eventId) => {
    let response = await request(`/events/${eventId}/teams`);

    if (response.status && response.status === 200) return response.data;
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
  
}

export const getTeams2WithMembers = async (eventId) => {
  let response = await request(`/events/${eventId}/teams/members`);

  if (response.status && response.status === 200) return response.data;
  if(response&&response.status==="401")
    toast("Your session has expired, please logout and login again.")

}

export const getRoundTeams = async (eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/teams`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const create = async (payload) => {
  let response = await request(`/events`, "POST", payload);

  return response;
}

export const edit = async (event,payload) => {
  let response = await request(`/events/${event}/edit`, "POST", payload);

  return response;
}


export const createRound = async (payload, eventId) => {
  let response = await request(`/events/${eventId}/rounds`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const createTeam = async (payload, eventId) => {
  let response = await request(`/events/${eventId}/teams`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const createSlots = async (payload, eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/slots`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const submitScore = async (payload, eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/scores`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'events'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}
