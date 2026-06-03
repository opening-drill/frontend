import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import config from './AircraftTable.config';
import { getAirCraftStatus } from "../../../../core/server/api/getAircraftStatus";
import Loader from "../general/Loader";
import type { aircraftType } from "./AircraftTable.type";
import type { AlertData } from "../../../../types/hamel";

const rows = [
  { id: "AC-001", name: "Boeing 737 MAX", price: 121_900_000, location: "Chicago O'Hare", status: "Available", payload: 20_000, velocity: 839 },
  { id: "AC-002", name: "Airbus A320neo", price: 101_000_000, location: "Paris CDG", status: "In Service", payload: 18_600, velocity: 833 },
  { id: "AC-003", name: "Cessna Citation X+", price: 23_000_000, location: "Teterboro, NJ", status: "Available", payload: 1_635, velocity: 978 },
  { id: "AC-004", name: "Gulfstream G700", price: 75_000_000, location: "Dubai Intl", status: "Reserved", payload: 2_948, velocity: 956 },
  { id: "AC-005", name: "Lockheed C-130J", price: 79_400_000, location: "Ramstein AFB", status: "In Service", payload: 19_090, velocity: 643 },
  { id: "AC-006", name: "Bell 429", price: 7_200_000, location: "Houston, TX", status: "Maintenance", payload: 1_043, velocity: 280 },
  { id: "AC-007", name: "Embraer E195-E2", price: 62_600_000, location: "São Paulo GRU", status: "Available", payload: 13_700, velocity: 870 },
  { id: "AC-008", name: "Airbus A350-900", price: 317_000_000, location: "Singapore Changi", status: "In Service", payload: 53_000, velocity: 903 },
  { id: "AC-009", name: "Dassault Falcon 10X", price: 80_000_000, location: "Geneva", status: "Available", payload: 3_130, velocity: 956 },
  { id: "AC-010", name: "Boeing B-52H", price: 84_000_000, location: "Barksdale AFB", status: "In Service", payload: 31_500, velocity: 1_000 },
  { id: "AC-011", name: "Sikorsky S-92", price: 17_000_000, location: "Aberdeen, UK", status: "Maintenance", payload: 4_536, velocity: 306 },
  { id: "AC-012", name: "Concorde G-BOAF", price: 0, location: "Filton Museum", status: "Retired", payload: 9_980, velocity: 2_179 },
  { id: "AC-013", name: "Pilatus PC-24", price: 11_000_000, location: "Zurich", status: "Available", payload: 1_325, velocity: 815 },
  { id: "AC-014", name: "ATR 72-600", price: 25_800_000, location: "Athens Intl", status: "In Service", payload: 7_500, velocity: 510 },
  { id: "AC-015", name: "Boeing 787-9", price: 292_500_000, location: "Tokyo Haneda", status: "Reserved", payload: 43_800, velocity: 903 },
];

export const  AircraftTable = (props: { setIsAircraftTableOpen: React.Dispatch<React.SetStateAction<boolean>>, handleAccept: (alert: AlertData) => void, alert: AlertData | null }) => {
  const [aircraft, setAircraft] = useState<aircraftType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  const fetchAircraft = async () => {
    try {
      setLoading(true);
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
  const [selectedAircraft, setSelectedAircraft] = useState<aircraftType | null>(null);

  const handleLaunch = (alert: AlertData) => {
    props.setIsAircraftTableOpen(false);
    props.handleAccept(alert);
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
        <Box sx={{ mb: 3 }}>
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
        <Box sx={{ height: 620, width: "100%" }}>
          <Loader isLoading={loading} timeOut={30}>
          <DataGrid
            rows={/*config.formatAircraftData(aircraft ?? [])*/ rows}
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
    }}}
             onRowClick={(newSelection) => {
                console.log('aa')
                console.log(newSelection.row)
                setSelectedAircraft(newSelection.row)
        // setRowSelectionModel(newSelection);

        // const selectedId = newSelection[0];
        // const aircraft =
        //   rows.find((row) => row.id === selectedId) ?? null;

        // setSelectedAircraft(aircraft);
      }}
          />
          <Button sx={{ width: 'fit-content', color: selectedAircraft !== null ? 'blue' : 'grey' }} onClick={() => handleLaunch({ ...props.alert!, aircraft_type: selectedAircraft!.type.name })} disabled={!selectedAircraft || !props.alert}>
          launch
        </Button>
        <Button sx={{ width: 'fit-content' }} onClick={() => props.setIsAircraftTableOpen(false)}>
          cancel
        </Button>
          </Loader>
        </Box>
      </Box>
  );
}
