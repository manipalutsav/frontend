import request from "../utils/request";
import { toast } from "../actions/toastActions";

const createPracticeSlot = async () => {
  let response = await request("/practiceslots", "POST", {});

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getPracticeSlot = async () => {
  let response = await request("/practiceslots", "GET");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const deletePracticeSlot = async () => {
  let response = await request("/practiceslots", "DELETE");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};


export default {
  createPracticeSlot,
  getPracticeSlot,
  deletePracticeSlot
};
