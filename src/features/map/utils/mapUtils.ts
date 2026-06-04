// Empty file for map utilities as requested
// Team 3 will populate this file with projection conversions,
// layer management logic, and other OpenLayers helpers.

export const initializeMapSystem = () => {
  console.log("Map system ready for initialization.");
};

export const LOCATIONS = {
  gaza: { coords: [34.4668, 31.5016], zoom: 12, name: "עזה" },
  jerusalem: { coords: [35.2137, 31.7683], zoom: 13, name: "ירושלים" },
  telAviv: {
    coords: [34.7818, 32.0853],
    zoom: 13,
    name: "תל אביב",
  },
};
