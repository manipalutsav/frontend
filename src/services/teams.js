import request from "../utils/request.js";
import { toast } from "../actions/toastActions.js";

const getTeamByCollegeAndEvent = async (collegeId, eventId) =>{
    let response = await request("/teams/"+ collegeId + "/"+ eventId);

    if (response && response.status === 200) {
        return response.data;
    } else {
        if (response && response.status === 401)
          toast("Your session has expired, please logout and login again.")
        return [];
    }
}

export default {
    getTeamByCollegeAndEvent
}