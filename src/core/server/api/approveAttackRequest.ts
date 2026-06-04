import type { AttackRequestIncome } from '../../../types/attackRequest'
import { alertsApi } from '../../api-config/alertsApi'
export const approveAttackRequest = (attackRequest:AttackRequestIncome) => alertsApi.post('/api/dispatch',{
     event_id: attackRequest.eventId,
  aircraft_id: attackRequest.aircraftId,
  start: attackRequest.start,
  end: attackRequest.end,
  urgency: attackRequest.urgency

})