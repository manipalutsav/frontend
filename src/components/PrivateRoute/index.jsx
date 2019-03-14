import React from "react";
import { navigate } from "gatsby";
import { getUser, isLoggedIn } from "../../services/userServices";

export default ({ component: Component, location, ...rest }) => {
  if (!isLoggedIn() && location.pathname !== "/login") {
    navigate("/login");
    return <h1>Access Denied</h1>;
  }

  let user = getUser();
  if (rest.type && rest.type < user.type) {
    // navigate("/home");
    return <h1>Access Denied</h1>;
  }

  return <Component {...rest} />;
};
