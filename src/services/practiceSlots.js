import request from "../utils/request.js";
import { toast } from "../actions/toastActions.js";

const createPracticeSlot = async (date) => {
  let response = await request("/practiceslots", "POST", {date});

  if (response && response.status === 200) {
    // let slots=[];
    // response.data.map(slot=>{

    // })
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getPracticeSlot = async (date) => {
  let response = await request("/practiceslots", "GET",);

  if (response && response.status === 200) {
    console.log(response.data)
    return response.data.filter(slot=>new Date(slot.date).getDay()==new Date(date).getDay());
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const deletePracticeSlot = async (date) => {
  let response = await request("/practiceslots", "DELETE",{date});

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
