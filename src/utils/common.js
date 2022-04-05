export const toUnitText = (quantity, unit) => `${quantity} ${quantity > 1 ? `${unit}s` : unit}`;

export const getTeamName = (slot) => {

    if (slot.college)
        return `${slot.college.name} ${slot.college.location} (${extractTeamName(slot.teamName).replace(/,/g, "")})`
    else
        return slot.teamName.replace(/,/g, "")
}

export const extractTeamName = (teamName) => {
    let start = teamName.lastIndexOf("(") + 1;
    let end = teamName.lastIndexOf(")");
    if (start > 0) {
        return teamName.substring(start, end);
    }
    else {
        return teamName;
    }
}

export const setSlotCollege = (slot) => {

    if (!slot.college) {
        let start = slot.teamName.lastIndexOf("(") + 1;
        let end = slot.teamName.lastIndexOf(")");
        if (start > 0) {
            let comma = slot.teamName.lastIndexOf(",");
            slot.college = {
                name: slot.teamName.substring(0, comma).trim(),
                location: slot.teamName.substring(comma + 1, start - 1).trim()
            };
            slot.teamName = slot.teamName.substring(start, end);
        }
        else {
            slot.college = { id: "", name: "", location: "" }
        }
    }

}