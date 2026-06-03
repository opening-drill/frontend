import type { UrgencyLevel } from './alertTypes';

export  interface AttackRequestIncome  {
    eventId:string;
    aircraftId:string;
    urgency: UrgencyLevel;
    start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
}