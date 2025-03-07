import request from "../utils/request.js";
import toast from '../reducers/toastReducer.js';

const get = async () => {
  let response = await request("/leaderboard");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

const getPublic = async () => {
  let response = await request("/leaderboard/public");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

const getRound = async (event,round) => {
  let response = await request(`/events/${event}/rounds/${round}/leaderboard`);
  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

const getWinners = async (event,round) => {
  let response = await request("/leaderboard/winners");
  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

const publish = async (leaderboard) => {
  let response = await request("/leaderboard/publish", "POST", leaderboard);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

export default {
  get,
  getPublic,
  getRound,
  getWinners,
  publish,
};
