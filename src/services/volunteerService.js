import request from "../utils/request";

export const addCoreVolunteer = async (payload) => {
  let response = await request(`/coreVolunteer/`, "POST", payload);
  return response;
}

export const updateCoreVolunteer = async (id, payload) => {
  let response = await request(`/coreVolunteer/${id}`, "PATCH", payload);
  return response;
}

export const deleteCoreVolunteer = async (id, payload) => {
  let response = await request(`/coreVolunteer/${id}`, "DELETE", payload);
  return response;
}

export const getCoreVolunteer = async (id) => {
  let response = await request(`/coreVolunteer/${id}`);
  return response;
}

export const getCoreVolunteers = async () => {
  let response = await request(`/coreVolunteer`);
  return response;
}

export const addEventVolunteer = async (payload) => {
  let response = await request(`/eventVolunteer/add`, "POST", payload);
  return response;
}

export const getEventVolunteers = async () => {
  let response = await request(`/eventVolunteer`);
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
