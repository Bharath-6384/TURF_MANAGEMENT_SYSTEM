export namespace LandingModel {
  export interface Sport {
    id             : number;
    name           : string;
    icon           : string;
    count          : string;
  }
  export interface Step {
    id             : number;
    step           : string;
    title          : string;
    description    : string;
  }
  export const Sports: Sport[] = [
    {
      id           : 1,
      name         : "Football",
      icon         : "⚽",
      count        : "480+ turfs",
    },
    {
      id           : 2,
      name         : "Box Cricket",
      icon         : "🏏",
      count        : "310+ turfs",
    },
    {
      id           : 3,
      name         : "Badminton",
      icon         : "🏸",
      count        : "260+ courts",
    },
    {
      id           : 4,
      name         : "Basketball",
      icon         : "🏀",
      count        : "140+ courts",
    },
    {
      id           : 5,
      name         : "Tennis",
      icon         : "🎾",
      count        : "90+ courts",
    },
    {
      id           : 6,
      name         : "Volleyball",
      icon         : "🏐",
      count        : "60+ courts",
    },
  ];
  export const Steps: Step[] = [
    {
      id           : 1,
      step         : "STEP 01",
      title        : "Search your ground",
      description  :
        "Filter turfs by sport, city, and price to find the pitch that fits your team.",
    },
    {
      id           : 2,
      step         : "STEP 02",
      title        : "Reserve your slot",
      description  :
        "Choose a date and time, pay securely online, and get instant confirmation.",
    },
    {
      id           : 3,
      step         : "STEP 03",
      title        : "Show up and play",
      description  :
        "Arrive at kickoff time — your slot, lights, and pitch are already locked in.",
    },
  ];
}