import request from "../utils/request";

export const addCoreVolunteer = async (payload) => {
  let response = await request(`/coreVolunteer/add`, "POST", payload);
  console.log(response);
  return response;
}

export const getCoreVolunteers = async () => {
  let response = await request(`/coreVolunteer`);
  return response;
}

export const addEventVolunteer = async (payload) => {
  let response = await request(`/eventVolunteer/add`, "POST", payload);
  console.log(response);
  return response;
}

// export const getVolunteer = async (payload) => {
//   let response = await request(`/volunteer/get`, "GET", payload);
//   console.log(response);
//   return response;
// }


// const getCollegeVolunteer = async (collegeId) => {
//   let response = await request(`/volunteer/get/${collegeId}`, "GET");
//   return response;
// }
