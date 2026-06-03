import React, { useState, useEffect, useCallback } from 'react';
import {Box, Button, Typography, Paper, TextField,} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const NUMBER_OF_TARGETS = 15;
const RADAR_SCAN_INTERVAL_MS = 4000;

const useStyles = makeStyles()((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    background: 'linear-gradient(180deg, #030712 0%, #0B1329 100%)',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: -1,

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundImage: `
        repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(56, 189, 248, 0.2) 41px, transparent 42px),
        repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 15deg, rgba(56, 189, 248, 0.07) 16deg, transparent 17deg)
      `,
      pointerEvents: 'none',
      opacity: 1,
      zIndex: 0,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '200vmax',
      height: '200vmax',
      transform: 'translate(-50%, -50%) rotate(0deg)',
      background: 'linear-gradient(90deg, transparent 50%, rgba(56, 189, 248, 0.15) 50%, rgba(56, 189, 248, 0.25) 60%, transparent 80%)',
      animation: 'big-radar-sweep 12s linear infinite',
      pointerEvents: 'none',
      opacity: 0.8,
      zIndex: 0,
    },

    '@keyframes big-radar-sweep': {
      '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
      '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
    },
  },

  redTarget: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    boxShadow: '0 0 10px 2px #ef4444',
    animation: 'blinkRed 2s infinite',
    zIndex: 1,
    pointerEvents: 'none',
  },

  '@keyframes blinkRed': {
    '0%, 100%': {
      opacity: 0.2,
      transform: 'scale(0.8)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.2)',
      boxShadow: '0 0 15px 3px rgba(239, 68, 68, 0.8)',
    },
  },

  paper: {
    width: '100%',
    maxWidth: 420,
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 6,
    background: 'rgba(11, 19, 43, 0.92)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.03)',
    zIndex: 10,
    position: 'relative',
  },

  telemetryText: {
    position: 'absolute',
    color: 'rgba(56, 189, 248, 0.5)',
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    letterSpacing: '1px',
    zIndex: 2,
    [theme.breakpoints.down('md')]: { display: 'none' },
  },
  telemetryLeft: {
    left: '40px',
    bottom: '40px',
  },
  telemetryRight: {
    right: '40px',
    bottom: '40px',
    alignItems: 'flex-end',
  },

  hudCorner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: 'rgba(56, 189, 248, 0.7)',
    borderStyle: 'solid',
    pointerEvents: 'none',
  },
  topLeft: { top: 12, left: 12, borderWidth: '2px 0 0 2px' },
  topRight: { top: 12, right: 12, borderWidth: '2px 2px 0 0' },
  bottomLeft: { bottom: 12, left: 12, borderWidth: '0 0 2px 2px' },
  bottomRight: { bottom: 12, right: 12, borderWidth: '0 2px 2px 0' },

  title: {
    color: '#FFFFFF',
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: theme.spacing(0.5),
    letterSpacing: '3px',
    textTransform: 'uppercase',
    fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
    textShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
  },

  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },

  form: {
    width: '100%',
  },

  input: {
    marginBottom: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      background: 'rgba(15, 23, 42, 0.7)',
      borderRadius: 4,
      color: '#FFFFFF',
      transition: 'all 0.2s ease',

      '& fieldset': {
        borderColor: 'rgba(56, 189, 248, 0.2)',
      },

      '&:hover fieldset': {
        borderColor: 'rgba(56, 189, 248, 0.6)',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#38bdf8',
        boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)',
      },
    },

    '& .MuiInputLabel-root': {
      color: '#64748B',
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#38bdf8',
    },
  },

  submit: {
    marginTop: theme.spacing(3),
    height: 48,
    borderRadius: 4,
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: 0.5,
    background: 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
      background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 25px rgba(2, 132, 199, 0.6)',
    },

    '&:active': {
      transform: 'translateY(1px)',
    }
  },

  footer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#475569',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    paddingTop: theme.spacing(2.5),
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px #10b981',
    animation: 'pulseStatus 2s infinite',

    '@keyframes pulseStatus': {
      '0%': {
        transform: 'scale(0.95)',
        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.6)',
      },
      '70%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 6px rgba(16, 185, 129, 0)',
      },
      '100%': {
        transform: 'scale(0.95)',
        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)',
      },
    },
  },
}));

interface BackgroundTarget {
  id: number;
  top: string;
  left: string;
  delay: string;
}

export const LogIn: React.FC = () => {
  const { classes } = useStyles();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [backgroundTargets, setBackgroundTargets] = useState<BackgroundTarget[]>([]);

  const generateFreshTargets = useCallback(() => {
    const targets: BackgroundTarget[] = [];
    for (let i = 0; i < NUMBER_OF_TARGETS; i++) {
      targets.push({
        id: Date.now() + i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * (RADAR_SCAN_INTERVAL_MS / 1000)}s`
      });
    }
    setBackgroundTargets(targets);
  }, []);

  useEffect(() => {
    generateFreshTargets();

    const scanInterval = setInterval(() => {
      generateFreshTargets();
    }, RADAR_SCAN_INTERVAL_MS);

    return () => clearInterval(scanInterval);
  }, [generateFreshTargets]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Dummy Auth Success:', {
      username,
      password,
    });

    alert(
      `נשלח לפונקציית התחברות:
משתמש: ${username}
סיסמה: ${password}`
    );

    window.location.href = '/';
  };

  return (
    <Box className={classes.container} dir="rtl">

      {/* מטרות אדומות רנדומליות המשתנות בכל סריקה */}
      {backgroundTargets.map(target => (
        <Box
          key={target.id}
          className={classes.redTarget}
          style={{
            top: target.top,
            left: target.left,
            animationDelay: target.delay
          }}
        />
      ))}

      <Paper elevation={0} className={classes.paper}>
        {/* כוונות HUD בארבעת הפינות של התיבה */}
        <Box className={`${classes.hudCorner} ${classes.topLeft}`} />
        <Box className={`${classes.hudCorner} ${classes.topRight}`} />
        <Box className={`${classes.hudCorner} ${classes.bottomLeft}`} />
        <Box className={`${classes.hudCorner} ${classes.bottomRight}`} />

        <Typography
          variant="h5"
          className={classes.title}
        >
          AIRCRAFT
        </Typography>

        <Typography
          variant="body2"
          className={classes.subtitle}
        >
          מתמונה בשטח להחלטה מבצעית בשניות
        </Typography>

        <form
          className={classes.form}
          onSubmit={handleLogin}
          noValidate
        >
          <TextField
            fullWidth
            required
            margin="normal"
            label="שם משתמש"
            value={username}
            className={classes.input}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <TextField
            fullWidth
            required
            margin="normal"
            type="password"
            label="סיסמא"
            value={password}
            className={classes.input}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            התחברות
          </Button>
        </form>

        <Box className={classes.footer}>
          <Box className={classes.statusDot} />
          רשת מסווגת - תדר מבצעי מוצפן ופעיל
        </Box>
      </Paper>
    </Box>
  );
};