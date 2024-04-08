import request from "../utils/request";
import toast from '../reducers/toastReducer';

const get = async (participantID) => {
  let response = await request("/participants/" + participantID);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return null;
  }
};

const update = async (participantID, participant) => {
  console.log(participant)
  let response = await request("/participants/" + participantID, "PATCH", participant);

  if (response && response.status === 200) {
    return true;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    return false;
  }
};

const deleteOne = async (eventID, teamID, participantID)=>{
  let response = await request("/events/"+eventID+"/teams/"+teamID +"/participants/" + participantID, "DELETE", {});

  if (response && response.status === 200) {
    return true;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    else if(response && response.status === 403) toast("Min. members should be there!")
    return false;
  }
}

export default {
  get,
  update,
  deleteOne
};
