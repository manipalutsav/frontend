import request from "../utils/request.js";
import { toast } from "../actions/toastActions.js";

const create = async (user) => {
  let response = await request("/users", "POST", user);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const remove = async (id) => {
  let response = await request("/users/" + id, "DELETE");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const get = async (id) => {
  let response = await request("/users/" + id);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const get2 = async (id) => {
  try {

    let response = await request("/users/" + id);
    if (response.staus)
      return toast(response.message);
    return response;
  }
  catch (err) {
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
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
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
