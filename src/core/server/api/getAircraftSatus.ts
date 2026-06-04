import { alertsApi } from "../../api-config/alertsApi";

export const getAirCraftStatus = () => alertsApi.get('/api/aircraft?status=free')