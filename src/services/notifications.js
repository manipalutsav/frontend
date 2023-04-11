import request from "../utils/request";
import { toast } from "../actions/toastActions";

const sendToMe = async (details) => {
  let response = await request("/notifications/sendToMe", "POST", details);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const sendToAllCoOrdinators = async (details) => {
  let response = await request("/notifications/sendToAllCoOrdinators", "POST", details);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getLog = async () => {
  let response = await request("/notifications/log");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};



export default {
  sendToMe,
  sendToAllCoOrdinators,
  getLog
};
