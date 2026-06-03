import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouter } from "./core/router";
import theme from "./core/theme";
import { MapProvider } from "./features/map/MapProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MapProvider>
        <AppRouter />
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
