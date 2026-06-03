import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouter } from "./core/router";
import theme from "./core/theme";
import { MapProvider } from "./features/map/MapProvider";

import { useEffect } from "react";

// Emotion/Stylis setup for RTL
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

// Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  useEffect(() => {
    document.dir = "rtl";
  }, []);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MapProvider>
          <AppRouter />
        </MapProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
