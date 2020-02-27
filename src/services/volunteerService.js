import request from "../utils/request";

export const create = async (payload) => {
    let response = await request(`/volunteer/addVolunteer`, "POST", payload);
    console.log(response);
    return response;
  }

  export const createEventVolunteer = async (payload) => {
    let response = await request(`/eventVolunteer/addEventVolunteer/`, "POST", payload);
    console.log(response);
    return response;
  }