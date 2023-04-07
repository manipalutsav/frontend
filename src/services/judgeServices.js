import request from "../utils/request";
import { send } from '../actions/commonActions';
import { toast } from "../actions/toastActions";

export const getAll = async () => {
  let response = await request("/judges");

  if (response && response.status === 200 && response.data) {
    send({
      list: response.data,
      src: 'judges',
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    send([]);
  }
}

export const get = async () => {
  let response = await request(`/judges`);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'judges'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const create = async (payload) => {
  let response = await request(`/judges`, "POST", payload);

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'judges'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}

export const deleteOne = async (id) => {
  let response = await request(`/judges/${id}`, "DELETE");
  console.log(id);
  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'judges'
    });
  } else {
    if(response&&response.status==="401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
}