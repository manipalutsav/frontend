import React from "react";
import { Router } from "@reach/router";
import ReactGA from "react-ga";

import PrivateRoute from "../components/PrivateRoute";
import Index from "../components/Index";
import Stats from "../components/Stats";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Colleges from "../components/Colleges";
import AddCollege from "../components/Colleges/Add";
import Users from "../components/Users";
import AddUser from "../components/Users/Add";
import EditUser from "../components/Users/Edit";
import ViewUser from "../components/Users/View";
import Judges from "../components/Judges";
import AddJudge from "../components/Judges/Add";
import Events from '../components/Events';
import Event from '../components/Events/Event';
import AddEvent from '../components/Events/Add';
import EventTeams from '../components/Events/Teams2';
import EventParticipants from '../components/Events/Participants';
import EditEvent from '../components/Events/Edit';
import Leaderboard from "../components/Leaderboard";
import PublicLeaderboard from "../components/PublicLeaderboard";
import Teams from "../components/Participants";
import Register from "../components/Registration";
import Participants from "../components/Registration/Participants";
import UpdateTeams from "../components/Registration/UpdateTeams";
import Members from "../components/Members";
import RegisterEvent from "../components/Registration/Event";
import RegisterTeam from "../components/Registration/Team";
import NotFound from "../components/404";
import Rounds from "../components/Rounds";
import AddEditRound from "../components/Rounds/AddEdit";
import Slots from "../components/Slots";
import PublicSlotsEvents from "../components/PublicSlots";
import PublicSlots from "../components/PublicSlots/Slots";
import Judge from "../components/Judges/StartJudging";
import ViewJudgeSheet from "../components/Judges/ViewJudgeSheet";
import RoundLeaderboard from '../components/Rounds/Leaderboard';
import Bias from '../components/Rounds/Bias';
import Download from '../components/Rounds/Download';
import CollegeTeams from "../components/CollegeTeams";
import EditMember from "../components/CollegeTeams/Edit";
import Rankings from "../components/CollegeTeams/rankings";
import Winners from "../components/Winners";
import Certificates from "../components/Certificates";

//Imported for volunteer
import AddVolunteer from "../components/Volunteer";
import Volunteer from "../components/Volunteer/Volunteer";
import VolunteerEdit from "../components/Volunteer/VolunteerEdit";
import CoreVolunteer from "../components/Volunteer/CoreVolunteer";
import EventVolunteer from "../components/Volunteer/EventVolunteer";
import EditCollege from "../components/Colleges/Edit";
import CoreVolunteerEdit from "../components/Volunteer/CoreVolunteerEdit";
// import AddVolunteer from "../components/Volunteer/AddVolunteer";
// import ViewCoreVolunteer from "../components/Volunteer/ViewCoreVolunteer";
// import ViewVolunteers from "../components/Volunteer/ViewVolunteers";



// import configureStore from "../store";

import Layout from "../layouts/app";
import PracticeSlots from "../components/PracticeSlots";
import PublicPracticeSlots from "../components/PublicPracticeSlots";
import Notifications from "../components/Notifications";
import PublicEvents from "../components/PublicEvents";
import Settings from "../components/Settings/Index";


if (typeof (document) != 'undefined')
  document.title = "MUCAPP";

const TRACKING_ID = "UA-183054936-1";
ReactGA.initialize(TRACKING_ID);

if (typeof window != "undefined") {
  // Only checking for pageview every 30 seconds to avoid spamming GA
  ReactGA.pageview(window.location.pathname + window.location.search);
  setInterval(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    console.log("GA pageview: " + window.location.pathname + window.location.search);
  }, 1000 * 30);
}

export default () =>
  <Layout>
    <Router css={{
      height: "100%",
    }}>
      <Index path="/" />
      <Login path="/login" />

      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/stats" component={Stats} />

      <PrivateRoute path="/users" component={Users} type={1} />
      <PrivateRoute path="/users/add" component={AddUser} type={1} />
      <PrivateRoute path="/users/:user" component={ViewUser} type={1} />
      <PrivateRoute path="/users/:user/edit" component={EditUser} type={1} />

      <PrivateRoute path="/events" component={Events} type={2} />
      <PrivateRoute path="/events/public" component={PublicEvents} type={2} />
      <PrivateRoute path="/events/add" component={AddEvent} type={1} />
      <PrivateRoute path="/events/:event" component={Event} type={2} />
      <PrivateRoute path="/events/:event/edit" component={EditEvent} type={1} />
      <PrivateRoute path="/events/:event/teams" component={EventTeams} type={2} />
      <PrivateRoute path="/events/:event/teams/:college/:team" component={EventParticipants} type={2} />
      <PrivateRoute path="/events/:event/rounds" exact component={Rounds} type={2} />
      <PrivateRoute path="/events/:event/rounds/add" exact component={AddEditRound} type={1} />
      <PrivateRoute path="/events/:event/rounds/:round/slot" exact component={Slots} type={2} />
      <PrivateRoute path="/events/:event/rounds/:round/edit" exact component={AddEditRound} type={1} />
      <PrivateRoute path="/events/:event/rounds/:round/leaderboard" exact component={RoundLeaderboard} type={1} />
      <PrivateRoute path="/events/:event/rounds/:round/bias" exact component={Bias} type={1} />
      <PrivateRoute path="/events/:event/rounds/:round/leaderboard/download" exact component={Download} type={2} />

      <PrivateRoute path="/colleges" component={Colleges} type={2} />
      <PrivateRoute path="/colleges/add" component={AddCollege} type={1} />
      <PrivateRoute path="/colleges/:college/edit" component={EditCollege} type={1} />
      <PrivateRoute path="/colleges/:college/teams" component={Teams} type={2} />
      <PrivateRoute path="/colleges/:college/teams/:team/members" component={Members} type={1} />

      <PrivateRoute path="/judges" component={Judges} type={2} />
      <PrivateRoute path="/judges/add" component={AddJudge} type={2} />
      <PrivateRoute path="/judge/:event/rounds/:round" exact component={Judge} type={2} />
      <PrivateRoute path="/events/:event/rounds/:round/scoresheet" exact component={ViewJudgeSheet} type={2} />

      <PrivateRoute path="/winners" component={Winners} type={2} />

      <PrivateRoute path="/leaderboard" component={Leaderboard} type={2} />
      <PrivateRoute path="/leaderboard/public" component={PublicLeaderboard} type={8} />

      <PrivateRoute path="/teams" component={CollegeTeams} type={8} />
      <PrivateRoute path="/teams/members/:member/edit" component={EditMember} type={8} />
      <PrivateRoute path="/teams/rankings" component={Rankings} type={8} />
      <PrivateRoute path="/register" component={Register} type={8} />
      <PrivateRoute path="/slots" component={PublicSlotsEvents} type={8} />
      <PrivateRoute path="/slots/:event" component={PublicSlots} type={8} />
      <PrivateRoute path="/register/:event" component={RegisterEvent} type={8} />
      <PrivateRoute path="/register/:event/teams" component={RegisterTeam} type={8} />
      <PrivateRoute path="/register/:event/teams/:team" component={Participants} type={8} />
      <PrivateRoute path="/register/:event/teams/:team/update" component={UpdateTeams} type={8} />
      <PrivateRoute path="/certificates" component={Certificates} type={8} />

      {/* For volunteers */}
      <PrivateRoute path="/volunteers" component={AddVolunteer} type={1 << 3} />
      <PrivateRoute path="/volunteers/core" component={CoreVolunteer} type={1 << 3} />
      <PrivateRoute path="/volunteers/core/:volunteerId" component={CoreVolunteerEdit} type={1 << 3} />
      <PrivateRoute path="/volunteers/:type" component={Volunteer} type={1 << 3} />
      <PrivateRoute path="/volunteers/:type/:volunteerId" component={VolunteerEdit} type={1 << 3} />

      <PrivateRoute path="/practice-slots" component={PracticeSlots} type={1} />
      <PrivateRoute path="/practice-slots/public" component={PublicPracticeSlots} type={8} />
      <PrivateRoute path="/notifications" component={Notifications} type={8} />

      <PrivateRoute path="/settings" component={Settings} type={1} />



      {/* <PrivateRoute path="/volunteers/event" component={EventVolunteer} type={1 << 3} /> */}
      {/* <PrivateRoute path="/viewCoreVolunteer" component={ViewCoreVolunteer} type={4} />
      <PrivateRoute path="/viewVolunteers/:collegeId" component={ViewVolunteers} type={4} /> */}

      <NotFound path="/*" component={NotFound} />
    </Router>
  </Layout>
  ;
