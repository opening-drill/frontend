import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

export interface ChiefToastProps {
  type: 'approved' | 'cancelled';
  location: string;
  arrivalTime?: string;
  timestamp?: string;
  closeToast?: () => void;
  // duration in ms for the TTL, used for custom progress bar
  duration?: number;
}

const useStyles = makeStyles()((theme) => ({
  card: {
    position: 'relative',
    backgroundColor: 'rgba(18, 24, 38, 0.95)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
    padding: '36px 20px 16px 20px', // Top padding pushed down so text starts below the 'x' button
    minWidth: '340px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden',
  },
  approvedCard: {
    borderLeft: '8px solid #2ecc71',
  },
  cancelledCard: {
    borderLeft: '8px solid #ff3b30',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '2px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  approvedDot: {
    backgroundColor: '#2ecc71',
  },
  cancelledDot: {
    backgroundColor: '#ff3b30',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.2,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  closeButton: {
    position: 'absolute',
    left: '8px',
    top: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '4px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    paddingRight: '16px', // Align with title text (accounting for the dot)
  },
  detailText: {
    fontSize: '14px',
    color: '#ffffff',
    fontWeight: 500,
    lineHeight: 1.4,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    animation: '$progress linear forwards',
  },
  '@keyframes progress': {
    from: { width: '100%' },
    to: { width: '0%' },
  },
}));

export const ChiefToast: React.FC<ChiefToastProps> = ({
  type,
  location,
  timestamp,
  closeToast
}) => {
  const { classes, cx } = useStyles();
  const isApproved = type === 'approved';

  return (
    <Box
      className={cx(
        classes.card,
        isApproved ? classes.approvedCard : classes.cancelledCard
      )}
    >
      {/* Close button on the top-left */}
      <IconButton
        className={classes.closeButton}
        onClick={closeToast}
        size="small"
        aria-label="close"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Header section with dot and title */}
      <Box className={classes.header}>
        <Box
          className={cx(
            classes.dot,
            isApproved ? classes.approvedDot : classes.cancelledDot
          )}
        />
        <Typography className={classes.title}>
          {isApproved ? 'דיווח מהחמ"ל: התקיפה אושרה' : 'דיווח מהחמ"ל: התקיפה בוטלה'}
        </Typography>
      </Box>

      {/* Body details */}
      <Box className={classes.details}>
        <Typography className={classes.detailText}>
          מיקום התקיפה: <span dir="ltr">[{location}]</span>
        </Typography>
        {timestamp && (
          <Typography className={classes.detailText} sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', marginTop: '4px', textAlign: 'left', width: '100%' }}>            {timestamp}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
