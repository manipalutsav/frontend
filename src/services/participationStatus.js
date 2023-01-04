import request from "../utils/request";
import toast from '../reducers/toastReducer';

const getByEvent = async (eventId) => {
  let response = await request("/participationStatus/event/" + eventId);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return null;
  }
};

const get = async () => {
  let response = await request("/participationStatus/");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return null;
  }
};

const getByCollege = async (collegeId) => {
  let response = await request("/participationStatus/college/" + collegeId);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return null;
  }
};

const create = async (participationStatuses) => {
  let response = await request("/participationStatus/", "POST", { participationStatuses });

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return [];
  }
};

export default {
  create,
  getByCollege,
  getByEvent,
  get
};
