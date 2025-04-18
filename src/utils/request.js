import constants from "../utils/constants.js";

const isBrowser = () => typeof window !== "undefined";

const getToken = () => {
  let me = isBrowser() && window.sessionStorage.getItem("me");

  if (!me) return null;
  me = JSON.parse(me);

  if ("token" in me) return me.token;
  return null;
};

const request = async (path, method = "GET", body, contentType = "application/json") => {
  const url = path ? constants.server + path : constants.server;
  const options = {
    credentials: "include",
    mode: "cors",
    method,
    headers: { Accept: "application/json" },
  };

  // auth‑token header if available
  const token = getToken();
  if (token) options.headers["Authorization"] = token;

  if (!["GET", "HEAD"].includes(method)) {
    if (body instanceof FormData) {
      // send the FormData directly
      options.body = body;
      // let the browser set Content-Type (with boundary) for you:
      // so don’t set options.headers["Content-Type"] at all
    } else {
      // assume JSON
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = contentType;
    }
  }

  const res = await window.fetch(url, options);
  return res.ok ? res.json() : Promise.reject(res);
};


export default request;
