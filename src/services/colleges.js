import request from "../utils/request";
import constants from "../utils/constants";
import { toast } from "../actions/toastActions";

const create = async (college) => {
  let response = await request("/colleges", "POST", college);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};


const get = async (collegeID) => {
  let response = await request("/colleges/" + collegeID);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getAll = async () => {
  let response = await request("/colleges");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

const getCollege = async(college)=>{
  try{
  
  let response = typeof window !== "undefined" && await window.fetch(`${constants.server}/colleges/${college}`,{
    credentials:"include"
  });
  let json = await response.json();
  if(json.status===200)
    return json.data;
  else
    toast(json.message);
  }
  catch(err){
    toast(err.message);
  }

}

const getTeams = async (collegeID) => {
  let response;

  if (collegeID) {
    response = await request("/colleges/" + collegeID + "/teams");
  } else {
    response = await request("/colleges/teams");
  }

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};


const getParticipants = async (collegeID) => {
  let response;

  if (collegeID) {
    response = await request("/colleges/" + collegeID + "/participants");
  } else {
    response = await request("/colleges/participants");
  }

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};
export default {
  create,
  get,
  getAll,
  getTeams,
  getParticipants,
  getCollege
};
