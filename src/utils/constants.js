import serverUrl from './serverUrl'

const userTypes = {
  ADMINISTRATOR: 1 << 0,
  SUPPORT_TEAM: 1 << 1,
  FACULTY_COORDINATOR: 1 << 2,
  STUDENT_COORDINATOR: 1 << 3,
};

if (window.location.hostname == "localhost" && !serverUrl.startsWith("http://localhost")) {
  window.alert("CAUTION: BACKEND IS SET TO " + serverUrl)
}

export const servers = {
  development: "http://localhost:3003",
  testing: "https://staging.manipalutsav.com",
  prodIP: "http://54.89.249.180:3003",
  production: "https://api.manipalutsav.com"
}

export default {
  // Whether the registrations are open for the following type of events.
  registrations: {
    facultyEvents: true,
    studentEvents: true,
  },
  USER_TYPES: userTypes,
  getUserType: (type) => {
    for (let userType in userTypes)
      if (userTypes.hasOwnProperty(userType))
        if (userTypes[userType] === type) return userType.replace(/_/g, " ");
  },
  ROUND_STATUS: {
    SCHEDULED: 1,
    ONGOING: 2,
    COMPLETED: 3,
  },
  fonts: {
    sansSerif: "Roboto, sans-serif",
    monospace: "Consolas, monospace",
  },
  colors: {
    accent: "#ffd100",      // Yellow-ish
    highlight: "#ff5800",   // Orange-ish
    black: "#000000",
    dark: "#111111",
    darkGrey: "#aaaaaa",
    lightGrey: "#bbbbbb",
    light: "#f5f5f5",
    white: "#ffffff",
  },
  server: serverUrl,
};
