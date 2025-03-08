import request from "../utils/request.js";
import { toast } from "../actions/toastActions.js";

const create = async (event) => {
  let response = await request("/events", "POST", event);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const createRound = async (eventID, round) => {
  let response = await request("/events/" + eventID + "/rounds", "POST", round);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const updateRound = async (eventID, roundID, round) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID, "POST", round);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const deleteRound = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID, "DELETE");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const createScores = async (eventId, roundId, judgeId, scores) => {
  try {
    let response = await request(`/events/${eventId}/rounds/${roundId}/judges/${judgeId}`, "POST", scores);
    console.log({ response })
    if (response && response.status === 200) {
      return true;
    } else {
      if (response && response.status === "401")
        toast("Your session has expired, please logout and login again.")
      else
        toast(response.message);
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

const backupScores = async (eventId, roundId, judgeId, backupData) => {
  try {
    let response = await request(`/events/${eventId}/rounds/${roundId}/judges/${judgeId}/backup`, "POST", backupData);
    console.log({ response })
    if (response && response.status === 200) {
      return true;
    } else {
      if (response && response.status === "401")
        toast("Your session has expired, please logout and login again.")
      else
        toast("Warning!: Failed to backup scores on server. Reason: " + response.message);
      return false;
    }
  } catch (e) {
    console.log(e);
    toast("Warning!: Failed to backup scores on server. Reason: " + e.message);
    return false;
  }
};

const getBackup = async (eventId, roundId, judgeId) => {
  try {
    let response = await request(`/events/${eventId}/rounds/${roundId}/judges/${judgeId}/backup`, "GET");
    if (response && response.status === 200) {
      return response.data;
    } else {
      if (response && response.status === "401")
        toast("Your session has expired, please logout and login again.")
      else
        toast("Failed to fetch backup, reason: " + response.message);
      return false;
    }
  } catch (e) {
    toast("Warning!: Failed to fetch backup. Reason: " + e.message);
    return false;
  }
};


const deleteBackup = async (eventId, roundId, judgeId) => {
  try {
    let response = await request(`/events/${eventId}/rounds/${roundId}/judges/${judgeId}/backup`, "DELETE");
    if (response && response.status === 200) {
      return true;
    } else {
      if (response && response.status === "401")
        toast("Your session has expired, please logout and login again.")
      else
        toast("Failed to delete backup, reason: " + response.message);
      return false;
    }
  } catch (e) {
    toast("Warning!: Failed to delete backup. Reason: " + e.message);
    return false;
  }
};

const getScores = async (eventId, roundId, judgeId) => {
  let response = await request(`/events/${eventId}/rounds/${roundId}/judges/${judgeId}`, "GET");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const createSlots = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/slots", "POST");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")

    return [];
  }
};

const createSlots2 = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/slots2", "POST");
  if (!response) {
    toast("Slotting: No response recieved");
    return [];
  }

  if (response.status === 200)
    return response.data;

  if (response.status === "401") {
    toast("Your session has expired, please logout and login again.")
    if (response && response.status === 404)
      toast("API not found")
    return [];
  }

  toast(response.message)
  return [];

};

const createTeam = async (eventID, team) => {
  let response = await request("/events/" + eventID + "/teams", "POST", team);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const updateTeam = async (eventID, teamID, team) => {

  let response = await request("/events/" + eventID + "/teams/" + teamID, "PATCH", team);
  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const deleteTeam = async (eventID, teamID) => {
  let response = await request("/events/" + eventID + "/teams/" + teamID, "DELETE");


  if (response && response.status === 200) {
    // return response.data;
    return true;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    else if(response && response.status === 400){
      // console.log(response)
      toast(response.message)
    }
    return null;
  }
};

const get = async (eventID) => {
  let response = await request("/events/" + eventID);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getAll = async () => {
  let response = await request("/events");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

const getRound = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return null;
  }
};

const getRounds = async (eventID) => {
  let response = await request("/events/" + eventID + "/rounds");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

const getSlots = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/slots");

  if (response && response.status === 200) {
    return response.data;
  } else {

    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

const getSlots2 = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/slots2");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    if (response && response.status === 404)
      toast("Api not found")
    return [];
  }
};

const deleteSlots2 = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/slots2/delete");

  if (response && response.status === 200) {
    return true;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    if (response && response.status === 404)
      toast("Api not found")
    return false;
  }
};

const getTeams = async (eventID) => {
  let response = await request("/events/" + eventID + "/teams");

  if (response && response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

const getTeamsByRound = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/teams");

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === "401")
      toast("Your session has expired, please logout and login again.")
    return [];
  }
};

const updateTeamScores = async (eventID, roundID, teams) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/scores", "PATCH", teams);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    else toast(response.message);
    return null;
  }
};

const updateSlotBias = async (eventID, roundID, teams) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/bias", "PATCH", teams);

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    else toast(response.message);
    return null;
  }
};

const publishRoundLeaderboard = async (eventID, roundID) => {
  let response = await request("/events/" + eventID + "/rounds/" + roundID + "/leaderboard", "PATCH", {});

  if (response && response.status === 200) {
    return response.data;
  } else {
    if (response && response.status === 401) toast("Your session has expired, please logout and login again.");
    else toast(response.message);
    return null;
  }
};

export default {
  create,
  createRound,
  createScores,
  createSlots,
  createSlots2,
  createTeam,
  deleteRound,
  deleteTeam,
  get,
  getAll,
  getRound,
  getScores,
  getRounds,
  getSlots,
  getSlots2,
  deleteSlots2,
  getTeams,
  getTeamsByRound,
  updateRound,
  updateTeam,
  updateTeamScores,
  publishRoundLeaderboard,
  updateSlotBias,
  backupScores,
  getBackup,
  deleteBackup
};
