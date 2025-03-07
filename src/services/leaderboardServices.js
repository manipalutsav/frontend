import request from "../utils/request.js";
import { send } from '../actions/commonActions.js';

export const getEventLeaderboard = async (eventId) => {
  let response = await request(`/events/${eventId}/leaderboard`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'leaderboard'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getRoundLeaderboard = async (eventId, roundId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/leaderboard`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'leaderboard'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const getLeaderboard = async () => {
  let response = await request(`/leaderboard`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'leaderboard'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}
