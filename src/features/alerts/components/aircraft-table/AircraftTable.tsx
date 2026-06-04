import styles from "./AircraftTable.module.css";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import config from './AircraftTable.config';
import Loader from "../general/Loader";
import type { aircraftRowType, aircraftType } from "./AircraftTable.type";
import type { AlertData } from "../../../../types/alertTypes";
import { getAirCraftStatus } from "../../../../core/server/api/getAircraftSatus";

type Aircraft = {
  id: string,
  name: string
  type: string
  price: number
  location: string
  status: string
  amount: number
  payload: number
  velocity: number
}

const FREE_STATUS = 'FREE'

export const  AircraftTable = ({setIsAircraftTableOpen, handleAccept, alert} :{ setIsAircraftTableOpen: React.Dispatch<React.SetStateAction<boolean>>, handleAccept: (alert: AlertData) => void, alert: AlertData | null }) => {
  const [aircraft, setAircraft] = useState<aircraftType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  const fetchAircraft = async () => {
    try {
      setLoading(true);
      const aircraftData = await getAirCraftStatus();
      setAircraft(aircraftData?.data?.aircraft ?? []);
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
  const [selectedAircraft, setSelectedAircraft] = useState<aircraftRowType | null>(null);

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
            rows={config.formatAircraftToRows(aircraft ?? [])}
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