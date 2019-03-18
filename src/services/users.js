import request from "../utils/request";
import constants from "../utils/constants";
import { toast } from "../actions/toastActions";

const create = async (user) => {
  let response = await request("/users", "POST", user);

  if (response && response.status === 200) {
    return response.data;
  } else {
    return null;
  }
};

const remove = async (id) => {
  let response = await request("/users/" + id, "DELETE");

  if (response && response.status === 200) {
    return response.data;
  } else {
    return null;
  }
};

const get = async (id) => {
  let response = await request("/users/" + id);

  if (response && response.status === 200) {
    return response.data;
  } else {
    return null;
  }
};

const get2 = async (id) => {
  try{
    let response = await fetch(`${constants.server}/users/${id}`,{
      credentials:"include"
    });
    let json = await response.json();
    if(json.staus)
      return toast(json.message);
    return json;
  }
  catch(err){
    toast(err.message);
  }

};

const getAll = async () => {
  let response = await request("/users");

  if (response && response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

const update = async (user) => {
  if (!user || !user.oldUser || !user.newUser) return null;

  let response = await request("/users/" + user.oldUser.id, "PATCH", user);

  if (response && response.status === 200) {
    return response.data;
  } else {
    return null;
  }
};

export default {
  create,
  remove,
  get,
  get2,
  getAll,
  update,
};
