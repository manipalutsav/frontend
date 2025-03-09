import request from "../utils/request.js";
import { send } from '../actions/commonActions.js';
import { toast } from "../actions/toastActions.js";

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

/**
 * Sends a DELETE request to remove a judge by ID and updates the UI accordingly.
 * - If successful, updates the judges list.
 * - Handles session expiration (401) and permission errors (403) with appropriate messages.
 * 
 * @param {string} id - The ID of the judge to delete.
 * @returns {null|void} Returns null if unauthorized or forbidden, otherwise updates the list.
 */
export const deleteJudgeById = async (id) => {
  let response = await request(`/judges/${id}`, "DELETE");

  if (response.status && response.status === 200) {
    send({
      list: response.data,
      src: 'judges'
    });
  } else {
    if(response&&response.status==="401"){
      toast("Your session has expired, please logout and login again.")
      return null;
    }
    if(response&&response.status==="403"){
      toast("You don't have permission to delete this judge.")
      return null;
    }
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
