import React from "react";
import { Router } from "@reach/router";

import PrivateRoute from "../components/PrivateRoute";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Colleges from "../components/Colleges";
import AddCollege from "../components/Colleges/Add";
import Users from "../components/Users";
import AddUser from "../components/Users/Add";
import Judges from "../components/Judges";
import AddJudge from "../components/Judges/Add";
import NotFound from "../components/404";

// import configureStore from "../store";

import Layout from "../layouts/app";

export default () =>
    <Layout>
      <Router css = {{
        height: "100%",
      }}>
        <Login path="/login" />
        <PrivateRoute path="/profile" component={ Profile } />
        <PrivateRoute path="/users" component={ Users } />
        <PrivateRoute path="/users/add" component={ AddUser } />
        <PrivateRoute path="/colleges" component={ Colleges } />
        <PrivateRoute path="/colleges/add" component={ AddCollege } />
        <PrivateRoute path="/judges" component={ Judges } />
        <PrivateRoute path="/judges/add" component={ AddJudge } />
        <NotFound path="/*" component={ NotFound } />
      </Router>
    </Layout>
;
