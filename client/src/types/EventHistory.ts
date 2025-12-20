export interface Placements {
  firstPlace: string;
  secondPlace: string;
  thirdPlace: string;
}

interface EventData {
  placements: Placements;
  logo: string;
}

export type EventHistory = Record<string, EventData>;
