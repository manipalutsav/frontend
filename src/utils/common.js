import collegeService from '../services/colleges';

export const toUnitText = (quantity, unit) => `${quantity} ${quantity > 1 ? `${unit}s` : unit}`;

const college_abbreviations = {
    "Manipal Institute of Technology": "MIT",
    "Kasturba Medical College": "KMC",
    "Manipal College of Pharmaceutical Sciences": "MCOPS",
    "Manipal College of Dental Sciences": "MCODS",
    "T A Pai Management Institute": "TAPMI",
    "Manipal Welcomgroup Graduate School of Hotel Administration": "WGSHA",
    "Manipal College of Nursing": "MCON",
    "International Center of Applied Sciences": "ICAS",
    "Manipal Institute of Communication": "MIC",
    "Manipal College of Health Professions": "MCHP",
    "Manipal Institute of Management": "MIM",
    "Department of Commerce": "DOC",
    "Manipal School of Architecture and Planning": "MSAP",
    "MAHE Teaching Departments": "MAHE TD",
    "Prasanna School of Public Health": "PSPH",
    "Manipal Institute of Virology": "MIV",
    "Manipal School of Life Sciences": "MSLS",
    "Manipal School of Information Sciences": "MSIS",
    "MAHE Dubai Campus": "MAHE",
    "MAHE Bengaluru": "MAHE",
    "Manipal Tata Medical College": "MTMC",
    "Manipal University Jaipur": "MUJ",
    "Sikkim Manipal University": "Sikkim MU",
    "Kasturba Hospital": "KH"
};

export const getTeamName = (slot) => {

    const alphabets = ['A', 'B', 'C', 'D', 'E'];

    // if (slot.college)
    //     return `${slot.college.name} ${slot.college.location} (${extractTeamName(slot.teamName).replace(/,/g, "")})`
    // else
    //     return slot.teamName.replace(/,/g, "")
    //
    return `${slot.college.name}, ${slot.college.location} (Team ${alphabets[slot.teamIndex]})`;
}

export const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const keyToDisplay = (key) => key ? key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ") : ""

export const getCertificateName = (item, isGroupEvent, isMultipleTeamsEvent) => {
    const alphabets = ['A', 'B', 'C', 'D', 'E'];
    let slot = item.slot;
    let college_name = slot.college.name in college_abbreviations ? college_abbreviations[slot.college.name] : slot.college.name;
    if (isGroupEvent) {
        if (isMultipleTeamsEvent) {
            return `#${slot.number} - ${college_name}, ${slot.college.location} (Team ${alphabets[slot.teamIndex]})`;
        } else {
            return `#${slot.number} - ${college_name}, ${slot.college.location}`;
        }
    } else {
        let participant_name_init = toTitleCase(item.team.participants[0].name);
        participant_name_init = participant_name_init.replace("Dr. ", "");
        participant_name_init = participant_name_init.replace("Dr ", "");

        participant_name_init = participant_name_init.replace("Mr. ", "");
        participant_name_init = participant_name_init.replace("Mr ", "");

        participant_name_init = participant_name_init.replace("Ms. ", "");
        participant_name_init = participant_name_init.replace("Ms ", "");

        participant_name_init = participant_name_init.replace("Mrs. ", "");
        participant_name_init = participant_name_init.replace("Mrs ", "");

        let participant_name_arr = participant_name_init.split(" ");
        let participant_name = "";
        participant_name += participant_name_arr[0] + " ";
        for (let i = 1; i < participant_name_arr.length; i++) {
            participant_name += participant_name_arr[i].charAt(0) + ". ";
        }
        return `#${slot.number} - ${toTitleCase(participant_name)} - ${college_name}, ${slot.college.location}`;
    }
}

// Disabled from 2nd April 12:00 AM. 
// From 15th April at 12:00 AM, it will be re-enabled.
// From 21st April 12:00 AM onwards it will be closed again
export const isTeamChangeFreezed = () => {
    const curDate = new Date();
    // New time period for editing
    const editWindowBeginDate = new Date("09/March/2024, 7:00 AM");
    const editWindowEndDate = new Date("11/March/2024, 11:59 PM");
    if (curDate > editWindowBeginDate && curDate <= editWindowEndDate) {
        return false;
    }
    // const freezeStartDate = new Date("02/April/2023");
    // const freezeEndDate = new Date("15/April/2023");
    // const freezeRestartDate = new Date("27/April/2023");

    // return ((curDate >= freezeStartDate && curDate < freezeEndDate) || (curDate > freezeRestartDate));
    return true;
}
export const loop = (count) => Array(count).fill(undefined);
