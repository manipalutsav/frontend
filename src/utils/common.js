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

export const keyToDisplay = (key) => key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ")