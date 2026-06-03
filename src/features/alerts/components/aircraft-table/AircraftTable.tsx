import styles from "./AircraftTable.module.css";
import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import config from './AircraftTable.config';

type Aircraft = {
  id: string,
  name: string
  type: string
  price: number
  location: string
  status: string
}

const rows: Aircraft[] = [
  { id: "AC-001", name: "Boeing 737 MAX", type: "Commercial Airliner", price: 121_900_000, location: "Chicago O'Hare", status: "Available" },
  { id: "AC-002", name: "Airbus A320neo", type: "Commercial Airliner", price: 101_000_000, location: "Paris CDG", status: "In Service" },
  { id: "AC-003", name: "Cessna Citation X+", type: "Business Jet", price: 23_000_000, location: "Teterboro, NJ", status: "Available" },
  { id: "AC-004", name: "Gulfstream G700", type: "Business Jet", price: 75_000_000, location: "Dubai Intl", status: "Reserved" },
  { id: "AC-005", name: "Lockheed C-130J", type: "Military Transport", price: 79_400_000, location: "Ramstein AFB", status: "In Service" },
  { id: "AC-006", name: "Bell 429", type: "Helicopter", price: 7_200_000, location: "Houston, TX", status: "Maintenance" },
  { id: "AC-007", name: "Embraer E195-E2", type: "Regional Jet", price: 62_600_000, location: "São Paulo GRU", status: "Available" },
  { id: "AC-008", name: "Airbus A350-900", type: "Wide-body Airliner", price: 317_000_000, location: "Singapore Changi", status: "In Service" },
  { id: "AC-009", name: "Dassault Falcon 10X", type: "Business Jet", price: 80_000_000, location: "Geneva", status: "Available" },
  { id: "AC-010", name: "Boeing B-52H", type: "Military Bomber", price: 84_000_000, location: "Barksdale AFB", status: "In Service" },
  { id: "AC-011", name: "Sikorsky S-92", type: "Helicopter", price: 17_000_000, location: "Aberdeen, UK", status: "Maintenance" },
  { id: "AC-012", name: "Concorde G-BOAF", type: "Supersonic Airliner", price: 0, location: "Filton Museum", status: "Retired" },
  { id: "AC-013", name: "Pilatus PC-24", type: "Business Jet", price: 11_000_000, location: "Zurich", status: "Available" },
  { id: "AC-014", name: "ATR 72-600", type: "Turboprop", price: 25_800_000, location: "Athens Intl", status: "In Service" },
  { id: "AC-015", name: "Boeing 787-9", type: "Wide-body Airliner", price: 292_500_000, location: "Tokyo Haneda", status: "Reserved" },
];

export default function AircraftTable(props: { setIsAircraftTableOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  return (
    <Box
      sx={{
        backgroundColor: "#0a0f1e",
        backgroundImage: "radial-gradient(ellipse at 20% 10%, rgba(56,189,248,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.04) 0%, transparent 60%)",
        p: { xs: 2, md: 4 },
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Header */}
      <Box >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <FlightIcon sx={{ color: "#38bdf8", fontSize: 22, transform: "rotate(45deg)" }} />
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "1.1rem",
            }}
          >
            Aircraft Registry
          </Typography>
        </Box>
        <Typography sx={{ color: "#475569", fontSize: "0.78rem", letterSpacing: "0.06em", pl: "34px" }}>
          {rows.length} aircraft · sortable · filterable
        </Typography>
      </Box>

      {/* Grid */}
      <Box sx={{ height: '90%', width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={config.columns}
          getRowId={(row) => row.id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 300 },
            },
          }}
          autoHeight
          sx={{
            border: "none",

            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "rgba(56,189,248,0.18)",
            },

            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "rgba(56,189,248,0.25)",
            },

            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },

            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            }
          }}
          onRowClick={(newSelection) => {
            console.log('aa')
            console.log(newSelection)
            const isSelected = newSelection.row?.id === selectedAircraft?.id;
            console.log(isSelected)
            setSelectedAircraft(isSelected ? null : newSelection.row)
          }}
        />
        <div className={styles.actions}>
          <button className={styles.acceptBtn} style={{ color: selectedAircraft === null ? 'grey' : '' }} onClick={() => props.setIsAircraftTableOpen(false)} disabled={selectedAircraft === null}>
            launch
          </button>
          <button className={styles.declineBtn} onClick={() => props.setIsAircraftTableOpen(false)}>
            cancel
          </button>
        </div>
      </Box>
    </Box>
  );
}
