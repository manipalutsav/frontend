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

  export const getVolunteer = async (payload) => {
    let response = await request(`/volunteer/get`, "GET", payload);
    console.log(response);
    return response;
  }

  export const getAll = async () => {
    let response = await request(`/volunteer`);
    return response;
  }
  const getCollegeVolunteer = async (collegeId) => {
    let response = await request(`/volunteer/get/${collegeId}`, "GET");
    return response;
  }

  export default { getCollegeVolunteer };