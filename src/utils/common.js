export const toUnitText = (quantity, unit) => `${quantity} ${quantity > 1 ? `${unit}s` : unit}`;

export const getTeamName = (slot) => {

    const alphabets = ['A', 'B', 'C', 'D', 'E'];

    // if (slot.college)
    //     return `${slot.college.name} ${slot.college.location} (${extractTeamName(slot.teamName).replace(/,/g, "")})`
    // else
    //     return slot.teamName.replace(/,/g, "")
    //
    return `${slot.college.name}, ${slot.college.location} (Team ${alphabets[slot.teamIndex]})`;
}

export const keyToDisplay = (key) => key ? key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ") : ""

// Disabled from 2nd April 12:00 AM. 
// From 15th April at 12:00 AM, it will be re-enabled.
// From 21st April 12:00 AM onwards it will be closed again
export const isTeamChangeFreezed = ()=>{
    const curDate = new Date();
    const freezeStartDate = new Date("02/April/2023");
    const freezeEndDate = new Date("15/April/2023");
    const freezeRestartDate = new Date("21/April/2023");

    return ((curDate>=freezeStartDate && curDate<freezeEndDate) || (curDate>freezeRestartDate));
}
export const loop = (count) => Array(count).fill(undefined);