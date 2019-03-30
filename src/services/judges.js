import request from "../utils/request";
import { toast } from "../actions/toastActions";

const create = async (judge) => {
  let response = await request("/judges", "POST", judge);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status===401)
      toast("Your session has expired, please logout and login again.")
    else
      toast(response.message);
    return null;
  }
};

const getAll = async () => {
  let response = await request("/judges");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if(response&&response.status===401)
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

export default {
  create,
  getAll,
};
