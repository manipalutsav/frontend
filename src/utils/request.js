import constants from "../utils/constants.js";

const isBrowser = () => typeof window !== "undefined";

const getToken = () => {
  let me = isBrowser() && window.sessionStorage.getItem("me");

  if (!me) return null;
  me = JSON.parse(me);

  if ("token" in me) return me.token;
  return null;
};

const request = async (path, method = "GET", body = {}) => {
  try {
    let url = path ? constants.server + path : constants.server;
    const options = {
      credentials: "include",
      mode: 'cors',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      method: method,
    };

    let token = getToken();
    if (token) options.headers["Authorization"] = token;

    if (!["GET", "HEAD"].includes(method))
      options.body = typeof body === "object" ? JSON.stringify(body) : body;

    let response = typeof window !== "undefined" && await window.fetch(url, options);
    if (response)
      return await response.json();
    else
      return "";
  } catch (e) {
    throw e;
  }
};

export default request;
