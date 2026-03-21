
export enum ScreenType {
  HOME = 'HOME',
  ROUTE = 'ROUTE',
  REPORT = 'REPORT',
  COMMUNITY = 'COMMUNITY',
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  PROFILE = 'PROFILE'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  time: string;
}
