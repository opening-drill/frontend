import { alertsApi } from "../../api-config/alertsApi";

export const getAirCraftStatus = () => alertsApi.get('/aircraft?status=free')