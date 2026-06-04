import styles from "./AircraftTable.module.css";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import config from './AircraftTable.config';
import { getAirCraftStatus } from "../../../../core/server/api/getAircraftStatus";
import Loader from "../general/Loader";
import type { aircraftRowType, aircraftType } from "./AircraftTable.type";
import type { AlertData } from "../../../../types/alertTypes";

type Aircraft = {
  id: string,
  name: string
  type: string
  price: number
  location: string
  status: string
  amount: number
  payload: number
}

const AVAILABLE_STATUS = 'Available'

const rows: Aircraft[] = [
  { id: "AC-001", name: "Boeing 737 MAX", type: "Commercial Airliner", price: 121_900_000, location: "Chicago O'Hare", status: "Available", amount: 1, payload: 444 },
  { id: "AC-002", name: "Airbus A320neo", type: "Commercial Airliner", price: 101_000_000, location: "Paris CDG", status: "In Service", amount: 4, payload: 4 },
  { id: "AC-003", name: "Cessna Citation X+", type: "Business Jet", price: 23_000_000, location: "Teterboro, NJ", status: "Available", amount: 2, payload: 55.7 },
  { id: "AC-004", name: "Gulfstream G700", type: "Business Jet", price: 75_000_000, location: "Dubai Intl", status: "Reserved", amount: 2, payload: 4 },
  { id: "AC-005", name: "Lockheed C-130J", type: "Military Transport", price: 79_400_000, location: "Ramstein AFB", status: "In Service", amount: 5, payload: 4 },
  { id: "AC-006", name: "Bell 429", type: "Helicopter", price: 7_200_000, location: "Houston, TX", status: "Maintenance", amount: 4, payload: 4 },
  { id: "AC-007", name: "Embraer E195-E2", type: "Regional Jet", price: 62_600_000, location: "São Paulo GRU", status: "Available", amount: 4, payload: 4 },
  { id: "AC-008", name: "Airbus A350-900", type: "Wide-body Airliner", price: 317_000_000, location: "Singapore Changi", status: "In Service", amount: 4, payload: 4 },
  { id: "AC-009", name: "Dassault Falcon 10X", type: "Business Jet", price: 80_000_000, location: "Geneva", status: "Available", amount: 4, payload: 298.3 },
  { id: "AC-010", name: "Boeing B-52H", type: "Military Bomber", price: 84_000_000, location: "Barksdale AFB", status: "In Service", amount: 4, payload: 4 },
  { id: "AC-011", name: "Sikorsky S-92", type: "Helicopter", price: 17_000_000, location: "Aberdeen, UK", status: "Maintenance", amount: 6, payload: 4 },
  { id: "AC-012", name: "Concorde G-BOAF", type: "Supersonic Airliner", price: 0, location: "Filton Museum", status: "Retired", amount: 8, payload: 4 },
  { id: "AC-013", name: "Pilatus PC-24", type: "Business Jet", price: 11_000_000, location: "Zurich", status: "Available", amount: 7, payload: 4 },
  { id: "AC-014", name: "ATR 72-600", type: "Turboprop", price: 25_800_000, location: "Athens Intl", status: "Available", amount: 4, payload: 4 },
  { id: "AC-015", name: "Boeing 787-9", type: "Wide-body Airliner", price: 292_500_000, location: "Tokyo Haneda", status: "Reserved", amount: 4, payload: 4 },
];

export const  AircraftTable = ({setIsAircraftTableOpen, handleAccept, alert} :{ setIsAircraftTableOpen: React.Dispatch<React.SetStateAction<boolean>>, handleAccept: (alert: AlertData) => void, alert: AlertData | null }) => {
  const [aircraft, setAircraft] = useState<aircraftType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  const fetchAircraft = async () => {
    try {
      setLoading(true);
      console.log(aircraft);
      const aircraftData = await getAirCraftStatus();
      setAircraft(aircraftData?.data ?? []);
    } catch (err) {
      console.error("Failed to load aircraft:", err);
      setAircraft([]); //remove when api is fixed
    } finally {
      setLoading(false);
    }
  };

  fetchAircraft();
}, []);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  const handleLaunch = (alert: AlertData) => {
    setIsAircraftTableOpen(false);
    handleAccept(alert);
  }

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
      </Box>

      {/* Grid */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ height: '63vh', width: "100%" }}>
          <Loader isLoading={loading}>
          <DataGrid
            rows={rows}
            //rows={rows.filter((row) => row.status === AVAILABLE_STATUS)}
            columns={config.columns}
            getRowId={(row) => row.id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 300 },
              },
            }}
            hideFooterSelectedRowCount
            hideFooterPagination
            // autoHeight
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
          </Loader>
        <div className={styles.actions}>
          <button className={styles.acceptBtn} style={{ background: selectedAircraft === null ? '#16a34a99' : '', color: selectedAircraft === null ? 'grey' : '' }}  onClick={() => handleLaunch({ ...alert!, aircraft_type: selectedAircraft!.name })} disabled={!selectedAircraft || !alert}>
            launch
          </button>
          <button className={styles.declineBtn} onClick={() => setIsAircraftTableOpen(false)}>
            cancel
          </button>
        </div>
      </Box>
    </Box>
    </Box>
  );
};