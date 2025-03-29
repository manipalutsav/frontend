import { toast } from "../actions/toastActions.js";
import request from "../utils/request.js";


/**
 * @typedef {"title" | "editTeamEnabled"} SettingValues
 */


/**
 * 
 * @param {SettingValues} setting 
 */
export const getSetting = async (setting) =>{
    let response = await request(`/settings/${setting}`);
    if(response.status == 200){
        return response.data;
    }else{
        console.error("Error in getSetting", response);
        return null
    }
}

export const getSettings = async () => {
    let response = await request(`/settings`);
    return response.data;
}

export const updateSettings = async ({title, editTeamEnabled , downloadCertificateEnabled , navbarDownloadCertificate , downloadFacultyCertificates }) => {
    const data = {title, editTeamEnabled , downloadCertificateEnabled, navbarDownloadCertificate ,downloadFacultyCertificates };
    let response = await request(`/settings`, 'POST', data);

    if(response?.status == 200){
        return response.data
    }else{
        console.error(response);
        toast("Failed to update!");
    }
}