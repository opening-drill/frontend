import { Box, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';


type LoaderProps = {
  children?: ReactNode;
  iconSize?: number | string;
  isLoading: boolean;
  timeOut?: number;
  title?: string;
};

const Loader: FC<LoaderProps> = ({ children, iconSize = 65, isLoading, timeOut = 40, title }) => {
  const timeOutID = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeTimeOut, setActiveTimeOut] = useState<boolean>(false);

  useEffect(() => {
    if (timeOut && !timeOutID.current) {
      timeOutID.current = setTimeout(() => setActiveTimeOut(true), 1000 * timeOut);
    }
  }, [timeOut]);

  if (!isLoading && children) {
    if(activeTimeOut) {
      setActiveTimeOut(false);
    }
    return children;
  }

  if (activeTimeOut) {
    return (
      <Box>
        משהו קרה... ננסה לטעון מחדש?
        <IconButton color="primary">
          <RefreshIcon onClick={() => window.location.reload()} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box> 
    <Box
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '80%',
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <CircularProgress size={iconSize} />
    {title}
  </Box>
</Box>
  );
};
export default Loader;