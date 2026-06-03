import { Box, Typography } from "@mui/material";
// import type { genericCellParam, numericCellParam, statusCellParam } from "./AircraftTable.type";
import FlightIcon from "@mui/icons-material/Flight";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { aircraftType } from "./AircraftTable.type";


// const statusConfig = {
//   Available: { color: "success", style: { backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80", borderColor: "rgba(74,222,128,0.3)" } },
//   "In Service": { color: "info", style: { backgroundColor: "rgba(56,189,248,0.15)", color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" } },
//   Maintenance: { color: "warning", style: { backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" } },
//   Retired: { color: "error", style: { backgroundColor: "rgba(239,68,68,0.12)", color: "#f87171", borderColor: "rgba(248,113,113,0.3)" } },
//   Reserved: { color: "secondary", style: { backgroundColor: "rgba(168,85,247,0.15)", color: "#c084fc", borderColor: "rgba(192,132,252,0.3)" } },
// };

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "#64748b", letterSpacing: "0.05em" }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "name",
    headerName: "Aircraft Name",
    width: 210,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FlightIcon sx={{ fontSize: 14, color: "#38bdf8", opacity: 0.7, transform: "rotate(45deg)" }} />
        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#e2e8f0" }}>{params.value}</Typography>
      </Box>
    ),
  },
  {
    field: "type",
    headerName: "Type",
    width: 190,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{params.value}</Typography>
    ),
  },
  {
    field: "price",
    headerName: "Price (USD)",
    width: 160,
    type: "number",
    valueFormatter: (value: number) =>
      value === 0 ? "Museum Piece" : `$${(value / 1_000_000).toFixed(1)}M`,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: params.value === 0 ? "#64748b" : "#a3e635", fontWeight: 500 }}>
        {params.value === 0 ? "Museum Piece" : `$${(params.value / 1_000_000).toFixed(1)}M`}
      </Typography>
    ),
  },
  {
    field: "payload",
    headerName: "Payload (kg)",
    width: 190,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{params.value}</Typography>
    ),
  },
  {
    field: "velocity",
    headerName: "Velocity (km/h)",
      width: 190,
    renderCell: (params: GridRenderCellParams) => (
      <Typography sx={{ fontSize: "0.82rem", color: "#94a3b8" }}>{params.value}</Typography>
    ),
  },
];

const formatAircraftData = (aircraft: aircraftType[]) => aircraft.map((ac: aircraftType) => ({
  id: ac.id,
  type: ac.type.name,
  price: ac.type.price,
  payload: ac.type.payloadKg,
  velocity: ac.type.velocityKmh,
}))

export default { columns, formatAircraftData };